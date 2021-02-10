from rest_framework import serializers

from .models import Profile, Video


class ProfileSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        profile = Profile.objects.create_user(
            **validated_data, email=validated_data["username"]
        )
        return profile

    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "age",
            "gender",
        )
        extra_kwargs = {"password": {"write_only": True}}


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ("id", "title")
