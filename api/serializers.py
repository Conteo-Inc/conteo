from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from .models import Video

import base64

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = payload_handler(obj)
        token = encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')


#NOTE:
#There are currently a couple of issues here
#1. The file needs a name, but not a title
class VideoSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        data = self.context.get('data')
        user = self.context.get('user')
        #Data is prepended by "data:video/mp4;base64,", need to remove those 22 characters
        #Encode converts from string to bytes
        data_bytes = data[22:].encode('ascii')
        instance = self.Meta.model(**validated_data)

        instance.created_by = user
        #ContentFile takes the data and creates a pseudo-file.
        #See https://docs.djangoproject.com/en/3.1/ref/files/file/#the-contentfile-class
        cf = ContentFile(data_bytes, name=instance.title)
        instance.video_file.save(instance.title, cf)

        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        
        video_file = instance.video_file
        video_file.open()

        #Raw base64 bytes need to be decoded to a string
        #and the data needs the header
        rep['video_file'] = "data:video/mp4;base64," + video_file.read().decode('UTF-8')
        video_file.close()

        return rep

    class Meta:
        model = Video
        fields = ('id', 'title', 'video_file')