import factory
from django.contrib.auth.hashers import make_password
from django.core.files.base import ContentFile
from django.db.models.signals import post_save
from factory.helpers import lazy_attribute, post_generation
from factory.random import random

from api.models import MatchStatus, Profile, User, Video


@factory.django.mute_signals()
class ProfileFactory(factory.django.DjangoModelFactory):
    @factory.lazy_attribute
    def first_name(self):
        return self.full_name.split(" ")[0]

    @factory.lazy_attribute
    def last_name(self):
        return self.full_name.split(" ")[1]

    phone_number = factory.Faker("phone_number")
    user = factory.SubFactory("api.factory.UserFactory", profile=None)
    birth_date = factory.Faker("date")

    @factory.lazy_attribute
    def gender(self):
        return random.choice(self.gender_choices)[0]

    class Meta:
        model = Profile

    class Params:
        full_name = factory.Faker("name")
        gender_choices = Profile.GENDER_CHOICES


@factory.django.mute_signals(post_save)
class UserFactory(factory.django.DjangoModelFactory):
    # @TODO: Prevent collisions here
    username = factory.Sequence(lambda n: "user%d@example.com" % n)
    email = factory.SelfAttribute("username")
    profile = factory.RelatedFactory(ProfileFactory, factory_related_name="user")

    @factory.lazy_attribute
    def password(self):
        return make_password(self.pw)

    class Meta:
        model = User

    class Params:
        pw = "ls"


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


class VideoFactory(factory.django.DjangoModelFactory):
    """Generates a Video object.
    This factory requires that `sender` and `receiver` be passed in.

    Video src defaults to `"video".encode()`.
    To customize video src, set `video_file=<some_src>`.
    """

    created_at = factory.Faker("date")
    viewed_at = factory.Faker("date")

    @post_generation
    def video_file(obj, create, extracted):
        """Generates the video_file after object creation.

        @param obj: the created object.

        @param create: boolean indicating which strategy was used.

        @param extracted: None unless a value was passed in at declaration time.
        """
        if not create:
            return

        data_bytes = extracted.encode() if extracted is not None else "video".encode()
        fname = "%d_%d_%s" % (obj.sender.id, obj.receiver.id, obj.created_at)
        cf = ContentFile(data_bytes, name=fname)
        obj.video_file.save(fname, cf)

    class Meta:
        model = Video
