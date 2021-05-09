from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.factory import UserFactory, VideoFactory
from api.models import MatchStatus, Profile


class ProfileTest(APITestCase):
    def setUp(self):
        def make_user(name: str) -> User:
            user = User.objects.create_user(username=name, password="password")
            Profile.objects.create(user=user, first_name=name)
            return user

        make_user("ale")
        boy = make_user("boy")
        boy.is_active = False

    def test_deactivate(self):
        self.client.login(username="ale", password="password")
        res = self.client.put("/api/profile/", {"paused": False}, format="json")
        self.assertEqual(res.status_code, 200)
        u = User.objects.get(username="ale")
        self.assertFalse(u.profile.paused)

    def test_activate(self):
        self.client.login(username="boy", password="password")
        res = self.client.put("/api/profile/", {"paused": True}, format="json")
        self.assertEqual(res.status_code, 200)
        u = User.objects.get(username="boy")
        self.assertTrue(u.profile.paused)


class MailListTest(APITestCase):
    def setUp(self):
        # main user, 3 penpals
        self.main_user = UserFactory(username="main@main.main", pw="main")
        self.p1, self.p2, self.p3 = UserFactory.create_batch(pw="test", size=3)
        # penpal 1 has not matched
        MatchStatus.objects.create(
            user_lo=self.main_user,
            user_hi=self.p1,
            user_lo_response=True,
            user_hi_response=None,
        )
        # penpal 2 has matched but no video
        MatchStatus.objects.create(
            user_lo=self.main_user,
            user_hi=self.p2,
            user_lo_response=True,
            user_hi_response=True,
        )
        # penpal 3 has matched and sent video
        MatchStatus.objects.create(
            user_lo=self.main_user,
            user_hi=self.p3,
            user_lo_response=True,
            user_hi_response=True,
        )

        VideoFactory(sender=self.p3, receiver=self.main_user)

    def test_retrieval(self):
        # main user logs in and gets mail
        self.client.login(username="main@main.main", password="main")
        mail = self.client.get("/api/mail/").json()

        penpals = mail.get("penpals")
        undecided = mail.get("undecided")

        # expected response structure: {penpals: [2], undecided: [1]}
        self.assertEqual(len(penpals), 2)
        self.assertEqual(len(undecided), 1)

        # check order of penpals: p3 first bc of sent video, then p2
        self.assertEqual(penpals[0].get("id"), self.p3.id)
        self.assertEqual(penpals[1].get("id"), self.p2.id)
        self.assertEqual(undecided[0].get("id"), self.p1.id)

        # check viewed_at is None for all except the first
        for mailitem in penpals[1:] + undecided:
            self.assertEqual(mailitem.get("viewed_at"), None)

        # check that p1 and p2 created_at is None
        self.assertEqual(penpals[1].get("created_at"), None)
        self.assertEqual(undecided[0].get("created_at"), None)

        # check that p3 created_at is not None
        self.assertFalse(penpals[0].get("created_at") is None)
