from typing import OrderedDict

from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.db.models.query_utils import Q
from django.utils.timezone import now
from rest_framework import serializers

from .models import Interest, MatchStatus, Privacy, Profile, Report, Video


class ProfileSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # get video
        video = None
        try:
            video = Video.objects.get(
                Q(sender=instance.user) & Q(receiver=instance.user)
            )
            video = read_video(video.video_file)
        finally:
            rep["video"] = video
            return rep

    class Meta:
        model = Profile
        exclude = ("user",)


class PrivacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Privacy
        fields = "__all__"


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = "__all__"


class UserAuthSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["first_name"] = instance.profile.first_name

        return rep

    class Meta:
        model = User
        fields = ("email",)


class ProfileFromUserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance: User):
        rep = super().to_representation(instance)  # type: OrderedDict
        rep.update(instance.profile.__dict__)
        rep.update({"interests": instance.profile.interest_set.values()})
        del rep["_state"]  # Not meant to be serialized

        # check for video
        rep["has_intro"] = False
        try:
            video = Video.objects.get(Q(sender=instance) & Q(receiver=instance))
            rep["has_intro"] = video is not None
        finally:
            return rep

    class Meta:
        model = User
        exclude = (
            "first_name",
            "last_name",
            "password",
            "is_superuser",
            "is_staff",
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserRegistrationSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.email = user.username
        user.save()

        # A profile with default data is created here. We can add more as needed
        # in the profile model.
        user.profile = Profile(user.id)
        user.profile.save()

        privacy = Privacy(profile=user.profile)
        privacy.save()

        return user

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}


def read_video(video):
    """
    @param video: A FieldFile representing the video.
    Commonly found on Video.video_file
    """
    try:
        return video.read().decode()
    finally:
        video.close()


class MailListSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["created_at"] = None
        rep["viewed_at"] = None

        receiver = self.context.get("receiver")
        # get videos sent, filter, and order
        sent_videos = instance.user.sent_videos.filter(receiver=receiver).order_by(
            "-created_at"
        )

        if len(sent_videos) > 0:
            latest_video = sent_videos[0]
            rep["created_at"] = latest_video.created_at
            rep["viewed_at"] = latest_video.viewed_at

        return rep

    class Meta:
        model = Profile
        fields = ("id", "first_name", "last_name", "paused")


class VideoSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = self.context.get("data")
        sender = self.context.get("user")

        # Data is prepended by "data:video/mp4;base64,"
        # Encode converts from string to bytes
        data_bytes = data.encode()
        instance = self.Meta.model(**validated_data)

        instance.sender = sender

        # We need to do this before save because we use it for fname
        instance.created_at = now()

        # ok we need to construct a filename
        fname = "%d_%d_%s" % (sender.id, instance.receiver.id, instance.created_at)

        # ContentFile takes the data and
        # creates a pseudo-file.
        # See
        # https://docs.djangoproject.com/en/3.1/ref/files/file/#the-contentfile-class
        cf = ContentFile(data_bytes, name=fname)
        instance.video_file.save(fname, cf)

        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        video_file = instance.video_file
        rep["video_file"] = read_video(video_file)

        return rep

    class Meta:
        model = Video
        fields = ("id", "video_file", "receiver")


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ("report_type", "reporter", "reportee", "description")


class MatchStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchStatus
        fields = ("user_lo_response", "user_hi_response")


class AccountSerializer(serializers.ModelSerializer):
    def to_representation(self, instance: User):
        rep = super().to_representation(instance)
        profile = instance.profile
        rep["first_name"] = profile.first_name
        rep["last_name"] = profile.last_name
        return rep

    class Meta:
        model = User
        fields = ("email",)
