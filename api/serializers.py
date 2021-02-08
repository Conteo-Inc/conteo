from django.contrib.auth import authenticate
from django.contrib.auth.models import User, update_last_login
from django.core.files.base import ContentFile
from django.utils.timezone import now
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from .models import UserProfile, Video

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("first_name", "last_name", "phone_number", "age", "gender")


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        # A profile with default data is created here. We can add more as needed
        # in the profile model.
        UserProfile.objects.create(
            user=user,
        )
        return user


class UserLoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        username = data.get("username", None)
        password = data.get("password", None)
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError(
                "A user with this email and password is not found."  # Not authenticated
            )
        try:
            payload = JWT_PAYLOAD_HANDLER(user)
            jwt_token = JWT_ENCODE_HANDLER(payload)
            update_last_login(None, user)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User with given email and password does not exists"  # User not found
            )
        return {"username": user.username, "token": jwt_token}


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
