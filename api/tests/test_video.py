from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import MatchStatus, Video


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
            "/api/videos/",
            {"data": self.video, "receiver": self.hi.id},
            format="json",
        )
        # hi receives the video
        videos = self.hi.received_videos.filter(sender=self.lo)
        self.assertEqual(len(videos), 1)

        # hi retrieves the video
        self.client.login(username="hi", password="hi")
        res = self.client.get("/api/videos/")
        results = res.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["video_file"], self.video)

        # hi sends to lo
        self.client.post(
            "/api/videos/", {"data": self.video, "receiver": self.lo.id}, format="json"
        )

        # lo receives the video
        videos = self.lo.received_videos.filter(sender=self.hi)
        self.assertEqual(len(videos), 1)

        # lo retrieves the video
        self.client.login(username="lo", password="lo")
        res = self.client.get("/api/videos/")
        results = res.json()
        self.assertEqual(len(results), 2)
        self.assertEqual(results[1]["video_file"], self.video)

    def test_video_viewed(self):
        # lo sends to hi
        self.client.login(username="lo", password="lo")
        self.client.post(
            "/api/videos/",
            {"data": self.video, "receiver": self.hi.id},
            format="json",
        )

        # hi retrieves the video
        self.client.login(username="hi", password="hi")
        res = self.client.get("/api/videos/")
        results = res.json()
        video_id = results[0]["id"]

        # check video viewed_at is None
        viewed_at = Video.objects.get(id=video_id).viewed_at
        self.assertTrue(viewed_at is None)

        # hi views the video
        self.client.put(f"/api/mailviewed/{video_id}/")

        # check video viewed_at is not None
        viewed_at = Video.objects.get(id=video_id).viewed_at
        self.assertFalse(viewed_at is None)
