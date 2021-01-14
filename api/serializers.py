from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

# from django.contrib.auth.models import User
from .models import User, UserProfile, Video

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("first_name", "last_name", "phone_number", "age", "gender")


class UserRegistrationSerializer(serializers.ModelSerializer):

    # profile = UserSerializer(required=False) #Uncomment this if we need to use profile data when creating an account

    class Meta:
        model = User
        fields = ("email", "password")
        # fields = ('email', 'password', 'profile') #We can use this if we need to make profile related data when creating an account
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # profile_data = validated_data.pop('profile') #We can use this if we need to make profile related data when creating an account
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(  # A profile with default data is created here. We can add more as needed in the profile model.
            user=user,
            # first_name=profile_data['first_name'],
            # last_name=profile_data['last_name'],
            # phone_number=profile_data['phone_number'],
            # age=profile_data['age'],
            # gender=profile_data['gender']
        )
        return user


class UserLoginSerializer(serializers.Serializer):

    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        email = data.get("email", None)
        password = data.get("password", None)
        user = authenticate(email=email, password=password)
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
        return {"email": user.email, "token": jwt_token}


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ("id", "title")
