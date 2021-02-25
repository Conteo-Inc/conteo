# from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import MatchStatus, Profile, Report, User


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


class VideoViewTestCase(APITestCase):
    def setUp(self):
        # create a sender and a receiver
        self.lo = User.objects.create_user(username="lo", password="lo")
        self.hi = User.objects.create_user(username="hi", password="hi")

        # match them together
        MatchStatus.objects.create(
            user_lo=self.lo,
            user_hi=self.hi,
            user_lo_response=True,
            user_hi_response=True,
        )
        self.video = "video"

    def test_send_video(self):
        # lo sends to hi
        self.client.login(username="lo", password="lo")
        self.client.post(
            "/api/video/",
            {"data": self.video, "receiver": self.hi.id},
            format="json",
        )

        # hi receives the video
        videos = self.hi.received_videos.filter(sender=self.lo)
        self.assertEqual(len(videos), 1)

        # hi retrieves the video
        self.client.login(username="hi", password="hi")
        res = self.client.get("/api/video/")
        results = res.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["video_file"], self.video)

        # hi sends to lo
        self.client.post(
            "/api/video/", {"data": self.video, "receiver": self.lo.id}, format="json"
        )

        # lo receives the video
        videos = self.lo.received_videos.filter(sender=self.hi)
        self.assertEqual(len(videos), 1)

        # lo retrieves the video
        self.client.login(username="lo", password="lo")
        res = self.client.get("/api/video/")
        results = res.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["video_file"], self.video)
