from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import Profile


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
