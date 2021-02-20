from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import MatchStatus, Report


class ReportViewTestCase(APITestCase):
    def setUp(self):
        self.ale = User.objects.create_user(username="ale", password="password")
        self.boy = User.objects.create_user(username="boy", password="password")

    def test_report(self):
        """
        Test reporting a user.

        Checks if a user can report another user through the reporting
        endpoint.
        """
        self.client.login(username="ale", password="password")
        res = self.client.post(
            "/api/report/",
            {
                "report_type": Report.ReportType.PROFILE,
                "reportee": self.boy.id,
            },
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        report = Report.objects.filter(reporter=self.ale.id).first()
        self.assertEqual(report.reporter, self.ale)
        self.assertEqual(report.reportee, self.boy)


class MatchesViewTestCase(APITestCase):
    def setUp(self):
        ale = User.objects.create_user(username="ale", password="password")
        boy = User.objects.create_user(username="boy", password="password")
        cad = User.objects.create_user(username="cad", password="password")
        dig = User.objects.create_user(username="dig", password="password")
        eel = User.objects.create_user(username="eel", password="password")
        fog = User.objects.create_user(username="fog", password="password")
        User.objects.create_user(username="gil", password="password")
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
        self.client.login(username="ale", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(res.json(), [{"username": "gil"}])
        self.client.login(username="boy", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            res.json(), [{"username": "dig"}, {"username": "fog"}, {"username": "gil"}]
        )
        self.client.login(username="cad", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            res.json(),
            [
                {"username": "dig"},
                {"username": "eel"},
                {"username": "fog"},
                {"username": "gil"},
            ],
        )
        self.client.login(username="dig", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            res.json(),
            [
                {"username": "ale"},
                {"username": "cad"},
                {"username": "eel"},
                {"username": "fog"},
                {"username": "gil"},
            ],
        )
        self.client.login(username="eel", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            res.json(),
            [
                {"username": "cad"},
                {"username": "dig"},
                {"username": "fog"},
                {"username": "gil"},
            ],
        )
        self.client.login(username="fog", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            res.json(),
            [
                {"username": "boy"},
                {"username": "cad"},
                {"username": "dig"},
                {"username": "eel"},
                {"username": "gil"},
            ],
        )
        self.client.login(username="gil", password="password")
        res = self.client.get("/api/match/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertCountEqual(
            res.json(),
            [
                {"username": "ale"},
                {"username": "boy"},
                {"username": "cad"},
                {"username": "dig"},
                {"username": "eel"},
                {"username": "fog"},
            ],
        )


class VideoViewTestCase(APITestCase):
    def setUp(self):
        # create a sender and a receiver
        self.sender = User.objects.create_user(username="sender", password="sender")
        self.receiver = User.objects.create_user(
            username="receiver", password="receiver"
        )

        # match them together
        MatchStatus.objects.create(
            user_lo=self.sender,
            user_hi=self.receiver,
            user_lo_response=True,
            user_hi_response=True,
        )
        self.video = "video"

    def test_send_video(self):
        self.client.login(username="sender", password="sender")
        self.client.post(
            "/api/video/",
            {"data": self.video, "receiver": self.receiver.id},
            format="json",
        )

        # Test that video was successfully received
        video = self.receiver.received_videos.filter(sender=self.sender)
        self.assertIsNotNone(video)

        # Test video retrieval
        self.client.login(username="receiver", password="receiver")
        res = self.client.get("/api/video/")
        results = res.json()

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["video_file"], self.video)
