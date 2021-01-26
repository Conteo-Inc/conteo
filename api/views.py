from .models import Video, UserProfile, User
from .serializers import VideoSerializer, UserRegistrationSerializer, UserLoginSerializer
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import generics, permissions, status
from django.http import HttpResponseRedirect
from rest_framework import status
from django.db.models import Q
import random
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from .models import Video
from .serializers import UserSerializer, UserSerializerWithToken, VideoSerializer


<<<<<<< HEAD
JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER

# @api_view(['GET'])
# def current_user(request):
#     """
#     Determine the current user via token and return data
#     """
    
#     serializer = UserSerializer(request.user)
#     return Response(serializer.data)

class UserRegistrationView(CreateAPIView):

    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        status_code = status.HTTP_201_CREATED
        user_profile = User.objects.get(email=request.data['email'])

        payload = JWT_PAYLOAD_HANDLER(user_profile)
        jwt_token = JWT_ENCODE_HANDLER(payload)
        response = {
            'success' : 'True',
            'status code' : status_code,
            'message': 'User registered  successfully',
            'token': jwt_token,
            'email': request.data['email']
            }
        
        return Response(response, status=status_code)

class UserLoginView(RetrieveAPIView):

    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = {
            'success' : 'True',
            'status code' : status.HTTP_200_OK,
            'message': 'User logged in  successfully',
            'token' : serializer.data['token'],
            'email': request.data['email']
            }
        status_code = status.HTTP_200_OK

        return Response(response, status=status_code)


class UserProfileView(RetrieveAPIView):

    permission_classes = (IsAuthenticated,)
    authentication_class = JSONWebTokenAuthentication

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            status_code = status.HTTP_200_OK
            response = {
                'success': 'true',
                'status code': status_code,
                'message': 'User profile fetched successfully',
                'email': user_profile.user.email,
                'data': [{
                    'first_name': user_profile.first_name,
                    'last_name': user_profile.last_name,
                    'phone_number': user_profile.phone_number,
                    'age': user_profile.age,
                    'gender': user_profile.gender,
                    }]
                }

        except Exception as e:
            status_code = status.HTTP_400_BAD_REQUEST
            response = {
                'success': 'false',
                'status code': status.HTTP_400_BAD_REQUEST,
                'message': 'User does not exists',
                'error': str(e)
                }
        return Response(response, status=status_code)

class VideoListCreate(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class Matches(generics.GenericAPIView):
    """
    View for requesting new matches for a user.
    """

    # TODO Need a more appropriate serializer
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Return a QuerySet of Users that can be served to the request user
        as a match.
        """
        req_user = self.request.user
        # All users that have no matches i.e. not in the MatchStatus table
        unmatched_users = User.objects.filter(
            matchstatus_hi__isnull=True, matchstatus_lo__isnull=True
        ).exclude(pk=req_user.pk)
        # All users that aren't matched with req_user
        q1 = User.objects.filter(
            ~Q(matchstatus_hi__user_lo=req_user) & ~Q(matchstatus_lo__user_hi=req_user)
        ).exclude(pk=req_user.pk)
        # All users for which user_hi = req_user AND
        # user_hi has not responded and user_lo has not declined
        q2 = User.objects.filter(
            Q(matchstatus_lo__user_hi=req_user)
            & Q(matchstatus_lo__user_hi_response__isnull=True)
            & ~Q(matchstatus_lo__user_lo_response=False)
        ).exclude(pk=req_user.pk)
        # All users for which user_lo = req_user AND
        # user_lo has not responded and user_hi has not declined
        q3 = User.objects.filter(
            Q(matchstatus_hi__user_lo=req_user)
            & Q(matchstatus_hi__user_lo_response__isnull=True)
            & ~Q(matchstatus_hi__user_hi_response=False)
        ).exclude(pk=req_user.pk)
        return unmatched_users.union(q1, q2, q3)

    def get(self, request: Request):
        max_amount = request.query_params.get("amount", 20)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        matches = random.sample(serializer.data, min(max_amount, len(serializer.data)))
        return Response(matches)
