import random

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.db.models.query import QuerySet
from rest_framework import (
    generics,
    permissions,
    request,
    response,
    status,
    views,
    viewsets,
)

from .models import (
    MatchStatus,
    Profile,
    Privacy,
    Video
)
from .serializers import (
    MailListSerializer,
    MatchStatusSerializer,
    ProfileFromUserSerializer,
    ProfileSerializer,
    PrivacySerializer,
    ReportSerializer,
    UserAuthSerializer,
    UserRegistrationSerializer,
    VideoSerializer,
)


class UserAuthView(generics.RetrieveAPIView):
    serializer_class = UserAuthSerializer

    def get(self, request):
        serializer = self.get_serializer(request.user)
        return response.Response(serializer.data, status=status.HTTP_200_OK)


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

    def post(
        self,
        request: request.Request,
    ):
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


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile

    def get(self, request):
        profile = request.user.profile
        profile_content = self.serializer_class(profile).data
        userId = profile_content.pop("id")

        privacy = Privacy.objects.get(profile=profile)
        privacy_settings = PrivacySerializer(privacy).data

        data = {
            "profile_content": profile_content,
            "privacy_settings": privacy_settings,
            "userId": userId,
        }

        return response.Response(data=data, status=status.HTTP_200_OK)

class PrivacyView(generics.RetrieveUpdateAPIView):
    serializer_class = PrivacySerializer
    queryset = Privacy.objects.all()

    def get(self, request):
        privacy = Privacy.objects.get(profile=request.user.profile)
        data = self.serializer_class(privacy).data

        return response.Response(data=data, status=status.HTTP_200_OK)


class MailListView(generics.ListAPIView):
    serializer_class = MailListSerializer

    def get_queryset(self):
        user = self.request.user
        case1 = Profile.objects.filter(
            Q(user__matchstatus_hi__user_lo=user)
            & Q(user__matchstatus_hi__user_lo_response=True)
            & Q(user__matchstatus_hi__user_hi_response=True)
        )
        # Case 2: User is user_hi
        case2 = Profile.objects.filter(
            Q(user__matchstatus_lo__user_hi=user)
            & Q(user__matchstatus_lo__user_lo_response=True)
            & Q(user__matchstatus_lo__user_hi_response=True)
        )

        # remove self
        # union = union.exclude(user=user)

        # make distinct
        union = QuerySet.union(case1, case2)

        return union

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(
            queryset, context={"receiver": request.user}, many=True
        )
        return response.Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
        )


class VideoListCreate(generics.ListCreateAPIView):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()

    def post(self, request, format=None):
        data = request.data.pop("data")
        serializer = self.serializer_class(
            data=request.data, context={"data": data, "user": request.user}
        )
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def get(self, request):
    #     queryset = self.filter_queryset(self.get_queryset())
    #     serializer = self.list_serializer_class(queryset, many=True)
    #     return response.Response(data=serializer.data, status=status.HTTP_200_OK)


class IntroVideoRetrieveView(views.APIView):
    serializer_class = VideoSerializer

    def get_object(self, profile_id):
        return Video.objects.get(Q(sender=profile_id) & Q(receiver=profile_id))

    def get(self, request, profile_id):
        video = self.get_object(profile_id=profile_id)
        serializer = self.serializer_class(video)
        return response.Response(serializer.data)


class VideoRetrieveView(generics.RetrieveAPIView):
    serializer_class = VideoSerializer

    def get_object(self, sender, receiver):
        videos = Video.objects.filter(Q(sender=sender) & Q(receiver=receiver)).order_by(
            "-created_at"
        )
        return videos[0]

    def get(self, request, sender):
        video = self.get_object(sender=sender, receiver=request.user)
        serializer = self.serializer_class(video)
        return response.Response(serializer.data)


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

    def post(self, request, *args, **kwargs):
        request.data["reporter"] = request.user.id
        return self.create(request, *args, **kwargs)
