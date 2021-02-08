import random

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, permissions, request, response, status, views

from .models import Profile, Video
from .serializers import (
    ProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    VideoSerializer,
)


class UserRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request: request.Request):
        response = self.create(request=request)
        userId = response.data["id"]
        user = User.objects.get(id=userId)
        login(request=request, user=user)

        return response


class UserLoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request: request.Request):
        username = request.data["username"]
        password = request.data["password"]

        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            login(request=request, user=user)
            return response.Response(status=status.HTTP_200_OK)

        return response.Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(generics.GenericAPIView):
    def post(self, request):
        logout(request=request)

        return response.Response(status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get(self, request):
        user = request.user
        return response.Response(
            data=ProfileSerializer(user.profile).data, status=status.HTTP_200_OK
        )


class VideoListCreate(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class Matches(generics.GenericAPIView):
    """
    View for requesting new matches for a user.
    """

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

    def get(self, request: request.Request):
        max_amount = request.query_params.get("amount", 20)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        matches = random.sample(serializer.data, min(max_amount, len(serializer.data)))
        return response.Response(matches)
