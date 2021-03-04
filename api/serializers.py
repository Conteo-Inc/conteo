from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.utils.timezone import now
from rest_framework import serializers

from .models import Profile, Report, Video


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class UserAuthSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["first_name"] = instance.profile.first_name

        return rep

    class Meta:
        model = User
        fields = ("email",)


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
        return user

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}


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
        video_file.open()

        # Raw base64 bytes need to be decoded to a string
        rep["video_file"] = video_file.read().decode()
        video_file.close()

        return rep

    class Meta:
        model = Video
        fields = ("id", "video_file", "receiver")


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ("report_type", "reporter", "reportee", "description")
