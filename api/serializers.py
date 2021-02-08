from django.contrib.auth.models import User
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
    class Meta:
        model = Video
        fields = ("id", "title")
