import random

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import (
    generics,
    permissions,
    request,
    response,
    status,
    views,
    viewsets,
)

from .models import MatchStatus, Video
from .serializers import (
    MatchStatusSerializer,
    ProfileFromUserSerializer,
    ProfileSerializer,
    ReportSerializer,
    UserRegistrationSerializer,
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


class UserAccountDeleteView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def delete(self, request):
        req_user = request.user
        req_user.delete()
        return response.Response(status=status.HTTP_200_OK)


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


class ProfileView(views.APIView):
    def get(self, request):
        user = request.user
        return response.Response(
            data=ProfileSerializer(user.profile).data, status=status.HTTP_200_OK
        )


class VideoListCreate(generics.ListCreateAPIView):
    serializer_class = VideoSerializer

    def get_queryset(self):
        user = self.request.user
        return Video.objects.filter(receiver=user)

    def post(self, request, format=None):
        data = request.data.pop("data")
        serializer = self.serializer_class(
            data=request.data, context={"data": data, "user": request.user}
        )
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Matches(viewsets.ModelViewSet):
    """
    Manages the collection of matches.
    """

    def get_serializer_class(self):
        if self.action == "list":
            return ProfileFromUserSerializer
        if self.action == "partial_update":
            return MatchStatusSerializer
        return super().get_serializer_class()

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

    def get_object(self):
        match_id = self.request.data["matchId"]
        lo = min(match_id, self.request.user.id)
        hi = max(match_id, self.request.user.id)

        # Amend request data for the serializer later
        if match_id == lo:
            self.request.data["user_hi_response"] = self.request.data["response"]
        else:
            self.request.data["user_lo_response"] = self.request.data["response"]

        obj, _ = MatchStatus.objects.get_or_create(user_lo_id=lo, user_hi_id=hi)
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request: request.Request):
        max_amount = request.query_params.get("amount", 20)
        response = super().list(request)
        response.data = random.sample(
            response.data, min(max_amount, len(response.data))
        )
        return response


class Reports(generics.CreateAPIView):
    serializer_class = ReportSerializer

    def post(self, request: request.Request, *args, **kwargs):
        request.data["reporter"] = request.user.id
        return self.create(request, *args, **kwargs)
