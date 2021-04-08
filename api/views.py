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

from .models import Interest, MatchStatus, Privacy, Profile, Video
from .serializers import (
    AccountSerializer,
    InterestSerializer,
    MailListSerializer,
    MatchStatusSerializer,
    PrivacySerializer,
    ProfileFromUserSerializer,
    ProfileSerializer,
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


class ProfileRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile

    def get(self, request):
        profile = request.user.profile
        profileData = self.serializer_class(profile).data
        userId = profileData.pop("id")

        # Add user interests to profile content.
        interestObjects = profile.interest_set.all()
        interestData = InterestSerializer(interestObjects, many=True).data
        profileData["interests"] = interestData

        # Get privacy object related to user profile.
        privacyObjects = Privacy.objects.get(profile=profile)
        privacyData = PrivacySerializer(privacyObjects).data

        data = {
            "profile_content": profileData,
            "privacy_settings": privacyData,
            "userId": userId,
        }

        return response.Response(data=data, status=status.HTTP_200_OK)

    def put(self, request):
        self.updateInterests(request)
        return self.update(request=request)

    def updateInterests(self, request):
        newInterests = None
        try:
            newInterests = request.data["interests"]
        except KeyError:
            # User did not updates their interests.
            pass

        if newInterests is not None:
            # Get IDs from new interests.
            idList = [interest["id"] for interest in newInterests if "id" in interest]
            profile = request.user.profile

            # Update user interests.
            profile.interest_set.clear()
            profile.interest_set.set(idList)


class PrivacyRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = PrivacySerializer
    queryset = Privacy.objects.all()


class InterestRetrieveView(generics.ListAPIView):
    serializer_class = InterestSerializer
    queryset = Interest.objects.all()


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

        res = None
        if serializer.is_valid():
            # Save new intro video.
            serializer.save()
            res = response.Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            res = response.Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        return res


class IntroVideoRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = VideoSerializer

    def get_object(self, userId):
        video = None
        try:
            video = Video.objects.get(sender=userId, receiver=userId)
        except Exception:
            # No pre-existing video.
            pass

        return video

    def get(self, request):
        video = self.get_object(request.user.id)

        # Test if an intro video exists.
        res = None
        if video is not None:
            serializer = self.serializer_class(video)
            res = response.Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            res = response.Response(status=status.HTTP_404_NOT_FOUND)

        return res

    def post(self, request):
        data = request.data.pop("data")
        serializer = self.serializer_class(
            data=request.data, context={"data": data, "user": request.user}
        )

        res = None
        if serializer.is_valid():
            oldVideo = self.get_object(request.user.id)

            # Save new intro video.
            serializer.save()

            # Delete old intro video.
            if oldVideo is not None:
                oldVideo.delete()

            res = response.Response(
                data=serializer.data, status=status.HTTP_201_CREATED
            )
        else:
            res = response.Response(
                data=serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        return res


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


class Accounts(generics.RetrieveAPIView):
    def get(self, request):
        serializer = AccountSerializer(request.user)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
