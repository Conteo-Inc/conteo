from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import MatchStatus, Profile


class MatchesViewTestCase(APITestCase):
    def setUp(self):
        def make_user(name: str):
            user = User.objects.create_user(username=name, password="password")
            Profile.objects.create(user=user, first_name=name)
            return user

        ale = make_user("ale")
        boy = make_user("boy")
        cad = make_user("cad")
        dig = make_user("dig")
        eel = make_user("eel")
        fog = make_user("fog")
        make_user("gil")
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
        user, users who have not declined the requesting user, and users
        for which the requesting user has not already made a decision for.
        """

        def firstnames(data):
            for profile in data:
                yield profile["first_name"]

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
