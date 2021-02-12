from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.utils.timezone import now
from rest_framework import serializers

from .models import Profile, Video


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


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

        # receiver = User.objects.get(id=validated_data.pop('receiver'))
        # Data is prepended by "data:video/mp4;base64,",
        # need to remove those 22 characters
        # Encode converts from string to bytes
        data_bytes = data[22:].encode("ascii")
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
        # and the data needs the header
        rep["video_file"] = "data:video/mp4;base64," + video_file.read().decode("UTF-8")
        video_file.close()

        return rep

    class Meta:
        model = Video
        fields = ("id", "video_file", "receiver")
