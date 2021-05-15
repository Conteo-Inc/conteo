from datetime import date, timedelta

from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import Interest, MatchStatus, Privacy, Profile


def firstnames(data):
    for profile in data:
        yield profile["first_name"]


class MatchesViewTestCase(APITestCase):
    def setUp(self):
        def make_user(name: str, age=None, gender=None, interests=None) -> User:
            user = User.objects.create_user(username=name, password="password")
            p = Profile.objects.create(
                user=user,
                first_name=name,
                gender=gender,
                birth_date=date.today() - timedelta(days=365.2425 * age)
                if age
                else None,
            )
            p.interest_set.add(interests)
            p.save()
            Privacy.objects.create(
                profile=p,
                birth_date_privacy=Privacy.Setting.PUBLIC,
                gender_privacy=Privacy.Setting.PUBLIC,
            )
            return user

        ale = make_user("ale", interests=Interest.objects.get(pk=1))
        boy = make_user("boy", 30)
        cad = make_user("cad", 40)
        dig = make_user("dig", 50)
        eel = make_user("eel", 60, Profile.GENDER_CHOICES[1][0])
        fog = make_user("fog", 70, Profile.GENDER_CHOICES[0][0])
        make_user("gil", 80)
        hal = make_user("hal", 80)
        hal.profile.paused = True
        hal.profile.save()

        MatchStatus.objects.create(
            user_lo=ale, user_hi=boy, user_lo_response=True, user_hi_response=True
        )
        MatchStatus.objects.create(
            user_lo=ale, user_hi=cad, user_lo_response=True, user_hi_response=False
        )
        MatchStatus.objects.create(
            user_lo=ale, user_hi=dig, user_lo_response=True, user_hi_response=None
        )
        MatchStatus.objects.create(
            user_lo=ale, user_hi=eel, user_lo_response=False, user_hi_response=True
        )
        MatchStatus.objects.create(
            user_lo=ale, user_hi=fog, user_lo_response=False, user_hi_response=False
        )
        MatchStatus.objects.create(
            user_lo=boy, user_hi=cad, user_lo_response=False, user_hi_response=None
        )
        MatchStatus.objects.create(
            user_lo=boy, user_hi=dig, user_lo_response=None, user_hi_response=True
        )
        MatchStatus.objects.create(
            user_lo=boy, user_hi=eel, user_lo_response=None, user_hi_response=False
        )
        MatchStatus.objects.create(
            user_lo=boy, user_hi=fog, user_lo_response=None, user_hi_response=None
        )

    def test_get_matches_basic(self):
        """
        Test for basic matching criteria.

        Basic matching criteria includes matching with users not in the
        MatchStatus model, users that have not matched with the requesting
        user, users who have not declined the requesting user, users
        for which the requesting user has not already made a decision for, and
        not the requesting user.
        """

        endpoint = "/api/matches/"

        self.client.login(username="ale", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), ("gil",))
        self.client.login(username="boy", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), ("dig", "fog", "gil"))
        self.client.login(username="cad", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            firstnames(res.json()),
            ("dig", "eel", "fog", "gil"),
        )
        self.client.login(username="dig", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            firstnames(res.json()),
            ("ale", "cad", "eel", "fog", "gil"),
        )
        self.client.login(username="eel", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            firstnames(res.json()),
            ("cad", "dig", "fog", "gil"),
        )
        self.client.login(username="fog", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            firstnames(res.json()),
            ("boy", "cad", "dig", "eel", "gil"),
        )
        self.client.login(username="gil", password="password")
        res = self.client.get(endpoint, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            firstnames(res.json()),
            ("ale", "boy", "cad", "dig", "eel", "fog"),
        )

    def test_update_match_status(self):
        """
        Check that a match status can be updated.
        """
        self.client.login(username="ale", password="password")
        res = self.client.put(
            "/api/matches/", {"matchId": 2, "response": False}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        obj = MatchStatus.objects.get(user_lo_id=1, user_hi_id=2)
        self.assertEqual(obj.user_lo_response, False)
        res = self.client.put(
            "/api/matches/", {"matchId": 2, "response": True}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        obj = MatchStatus.objects.get(user_lo_id=1, user_hi_id=2)
        self.assertEqual(obj.user_lo_response, True)

        self.client.login(username="boy", password="password")
        res = self.client.put(
            "/api/matches/", {"matchId": 1, "response": False}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        obj = MatchStatus.objects.get(user_lo_id=1, user_hi_id=2)
        self.assertEqual(obj.user_hi_response, False)
        res = self.client.put(
            "/api/matches/", {"matchId": 1, "response": True}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        obj = MatchStatus.objects.get(user_lo_id=1, user_hi_id=2)
        self.assertEqual(obj.user_hi_response, True)

    def test_matching_filters(self):
        """
        Check that the filters are used to narrow match results.
        """
        self.client.login(username="dig", password="password")
        res = self.client.get(
            "/api/matches/", {"minAge": 59, "maxAge": 71}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), ("eel", "fog"))

        res = self.client.get(
            "/api/matches/",
            {
                "minAge": 59,
                "maxAge": 71,
                "genders": [Profile.GENDER_CHOICES[0][0], Profile.GENDER_CHOICES[2][0]],
            },
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), ("fog",))

        res = self.client.get(
            "/api/matches/",
            {
                "minAge": 59,
                "maxAge": 71,
                "genders": [Profile.GENDER_CHOICES[0][0], Profile.GENDER_CHOICES[2][0]],
                "interests": Interest.objects.filter(pk=2).values_list("id", flat=True),
            },
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), [])

        res = self.client.get(
            "/api/matches/",
            {
                "interests": Interest.objects.filter(pk=1).values_list("id", flat=True),
            },
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), ("ale",))

    def test_inactive_users(self):
        """
        Check that inactive users are not suggested as matches.
        """
        self.client.login(username="dig", password="password")
        res = self.client.get(
            "/api/matches/", {"minAge": 75, "maxAge": 85}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(firstnames(res.json()), ("gil",))
