from collections import OrderedDict

from django.contrib.auth.models import User
from django.test import Client, TestCase
from rest_framework.response import Response

from api.models import MatchStatus


class MatchesViewTestCase(TestCase):
    def setUp(self):
        ale = User.objects.create_user(username="ale", password="password")
        boy = User.objects.create_user(username="boy", password="password")
        cad = User.objects.create_user(username="cad", password="password")
        dig = User.objects.create_user(username="dig", password="password")
        eel = User.objects.create_user(username="eel", password="password")
        fog = User.objects.create_user(username="fog", password="password")
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
        client = Client()
        client.login(username="ale", password="password")
        res = client.get("/api/match/")  # type: Response
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, [])
        client.login(username="boy", password="password")
        res = client.get("/api/match/")  # type: Response
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data, [OrderedDict(username="dig"), OrderedDict(username="fog")]
        )
        client.login(username="cad", password="password")
        res = client.get("/api/match/")  # type: Response
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data,
            [
                OrderedDict(username="dig"),
                OrderedDict(username="eel"),
                OrderedDict(username="fog"),
            ],
        )
        client.login(username="dig", password="password")
        res = client.get("/api/match/")  # type: Response
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data,
            [
                OrderedDict(username="ale"),
                OrderedDict(username="cad"),
                OrderedDict(username="eel"),
                OrderedDict(username="fog"),
            ],
        )
        client.login(username="eel", password="password")
        res = client.get("/api/match/")  # type: Response
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data,
            [
                OrderedDict(username="cad"),
                OrderedDict(username="dig"),
                OrderedDict(username="fog"),
            ],
        )
        client.login(username="fog", password="password")
        res = client.get("/api/match/")  # type: Response
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data,
            [
                OrderedDict(username="boy"),
                OrderedDict(username="cad"),
                OrderedDict(username="dig"),
                OrderedDict(username="eel"),
            ],
        )
        # TODO check for matches with users not in the MatchStatus database
