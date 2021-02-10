# from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import MatchStatus, Profile


class MatchesViewTestCase(APITestCase):
    def setUp(self):
        ale = Profile.objects.create_user(username="ale", password="password")
        boy = Profile.objects.create_user(username="boy", password="password")
        cad = Profile.objects.create_user(username="cad", password="password")
        dig = Profile.objects.create_user(username="dig", password="password")
        eel = Profile.objects.create_user(username="eel", password="password")
        fog = Profile.objects.create_user(username="fog", password="password")
        Profile.objects.create_user(username="gil", password="password")
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

        def usernames(data: list[dict]):
            for profile in data:
                yield profile["username"]

        self.client.login(username="ale", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(usernames(res.json()), ("gil",))
        self.client.login(username="boy", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(usernames(res.json()), ("dig", "fog", "gil"))
        self.client.login(username="cad", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            usernames(res.json()),
            ("dig", "eel", "fog", "gil"),
        )
        self.client.login(username="dig", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            usernames(res.json()),
            ("ale", "cad", "eel", "fog", "gil"),
        )
        self.client.login(username="eel", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            usernames(res.json()),
            ("cad", "dig", "fog", "gil"),
        )
        self.client.login(username="fog", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            usernames(res.json()),
            ("boy", "cad", "dig", "eel", "gil"),
        )
        self.client.login(username="gil", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            usernames(res.json()),
            ("ale", "boy", "cad", "dig", "eel", "fog"),
        )
