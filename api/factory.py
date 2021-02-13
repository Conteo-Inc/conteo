import random

import factory
from django.db.models.signals import post_save
from factory.helpers import lazy_attribute

from api.models import GENDER_CHOICES, MatchStatus, Profile, User


@factory.django.mute_signals()
class ProfileFactory(factory.django.DjangoModelFactory):
    @factory.lazy_attribute
    def first_name(self):
        return self.full_name.split(" ")[0]

    @factory.lazy_attribute
    def last_name(self):
        return self.full_name.split(" ")[1]

    phone_number = factory.Faker("phone_number")
    user = factory.SubFactory("api.factories.UserFactory", profile=None)
    birth_date = factory.Faker("date")

    @factory.lazy_attribute
    def gender(self):
        return random.choice(GENDER_CHOICES)[0]

    class Meta:
        model = Profile

    class Params:
        full_name = factory.Faker("name")


@factory.django.mute_signals(post_save)
class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Sequence(lambda n: "user%d@example.com" % n)
    email = factory.SelfAttribute("username")
    profile = factory.RelatedFactory(ProfileFactory, factory_related_name="user")

    class Meta:
        model = User


class MatchStatusFactory(factory.django.DjangoModelFactory):
    @lazy_attribute
    def user_lo_response(self):
        return random.choice(self.response_choices)

    @lazy_attribute
    def user_hi_response(self):
        return random.choice(self.response_choices)

    class Meta:
        model = MatchStatus

    class Params:
        response_choices = [True, False, None]
