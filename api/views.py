import random
from datetime import date, timedelta

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.core.files.base import ContentFile
from django.core.mail import send_mail
from django.db.models import Q
from django.db.models.query import QuerySet
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.timezone import now
from django.views import View
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
from .utils import account_activation_token


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


# send email..
class UserForgotPassword(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data["username"]
        # check if email exists
        if User.objects.filter(username=username).exists():
            # encode userId
            currentUser = User.objects.get(username__exact=username)
            uidb64 = urlsafe_base64_encode(
                force_bytes(currentUser.pk)
            )  # encoded userId
            # get domain we are on
            domain = get_current_site(request).domain
            # relative url for verification
            link = reverse(
                "activate",
                kwargs={
                    "uidb64": uidb64,
                    "token": account_activation_token.make_token(currentUser),
                },
            )
            reset_url = "http://" + domain + link
            try:
                send_mail(
                    "Password reset request",
                    "Hi "
                    + currentUser.username
                    + " Please use this link to reset your account\n"
                    + reset_url,
                    "conteobot@gmail.com",
                    [username],
                    fail_silently=False,
                )
            except OSError:
                return response.Response(status=status.HTTP_400_BAD_REQUEST)
            return response.Response(status=status.HTTP_200_OK)

        return response.Response(status=status.HTTP_400_BAD_REQUEST)


# Used to render password reset page for user
class UserVerificationCode(View):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64, token):
        return redirect("/verification/" + uidb64 + "/" + token)


class UserChangePassword(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        newPassword = request.data["newPassword"]
        encodedUidb64 = request.data["uidb64"]
        token = request.data["token"]
        # update user password
        try:
            id_ = force_text(urlsafe_base64_decode(encodedUidb64))
            user = User.objects.get(pk=id_)
            if not account_activation_token.check_token(user, token):
                print("Account token problem")
                return response.Response(status=status.HTTP_400_BAD_REQUEST)
            user.set_password(newPassword)  # Use newPassword her
            user.save()
        except Exception as ex:
            print("Exc: " + str(ex))
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
        return response.Response(status=status.HTTP_200_OK)


class UserLoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request: request.Request):
        username = request.data["username"]
        password = request.data["password"]
        reactivate = request.data.get("reactivate", False)

        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            if reactivate:
                user.profile.paused = False
                user.profile.save()
            if user.profile.paused:
                return response.Response("Profile is paused", status.HTTP_409_CONFLICT)
            login(request=request, user=user)
            return response.Response(status=status.HTTP_200_OK)

        return response.Response(status=status.HTTP_401_UNAUTHORIZED)


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
        self.updateImage(request)
        self.updateInterests(request)
        return self.update(request=request)

    def updateImage(self, request):
        imageData = None
        try:
            imageData = request.data.pop("image")
        except KeyError:
            # Image was not updated.
            pass

        if imageData is not None:
            # Data is prepended by "data:image/*;base64,".
            # Encode converts from string to bytes.
            data_bytes = imageData.encode()

            # Create the image content file.
            created_at = now()
            fname = f"{request.user.id}_{created_at}"
            cf = ContentFile(data_bytes, name=fname)

            # Save the profile image field.
            request.user.profile.image.save(fname, cf)

    def updateInterests(self, request):
        newInterests = None
        try:
            newInterests = request.data["interests"]
        except KeyError:
            # Interests were not updated.
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

    def get_mail_list(self, user, match_decision=True):
        case1 = Profile.objects.filter(
            Q(user__matchstatus_hi__user_lo=user)
            & Q(user__matchstatus_hi__user_lo_response=True)
            & Q(user__matchstatus_hi__user_hi_response=match_decision)
        )
        # Case 2: User is user_hi
        case2 = Profile.objects.filter(
            Q(user__matchstatus_lo__user_hi=user)
            & Q(user__matchstatus_lo__user_lo_response=match_decision)
            & Q(user__matchstatus_lo__user_hi_response=True)
        )

        # make distinct
        usion = QuerySet.union(case1, case2)
        return self.get_serializer(usion, context={"receiver": user}, many=True).data

    def get(self, request):
        penpals = self.get_mail_list(request.user)
        undecided = self.get_mail_list(request.user, None)
        data = {
            "penpals": penpals,
            "undecided": undecided,
        }

        return response.Response(
            data=data,
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
        req = self.request  # type: request.Request
        invalid_users = User.objects.filter(
            # Users req_user has responded to
            Q(
                matchstatus_hi__user_lo=req.user,
                matchstatus_hi__user_lo_response__isnull=False,
            )
            | Q(
                matchstatus_lo__user_hi=req.user,
                matchstatus_lo__user_hi_response__isnull=False,
            )
            # Users that have declined req_user
            | Q(
                matchstatus_hi__user_lo=req.user, matchstatus_hi__user_hi_response=False
            )
            | Q(
                matchstatus_lo__user_hi=req.user, matchstatus_lo__user_lo_response=False
            )
            | Q(profile__paused=True)
        )

        min_age = int(req.query_params.get("minAge", 18))
        max_age = int(req.query_params.get("maxAge", 130))
        genders = req.query_params.getlist(
            "genders", (v for v, _ in Profile.GENDER_CHOICES)
        )
        interests = req.query_params.getlist(
            "interests", Interest.objects.values_list("id", flat=True)
        )
        hi_date = date.today() - timedelta(days=365.2425 * min_age)
        lo_date = date.today() - timedelta(days=365.2425 * max_age)
        return (
            User.objects.filter(
                profile__gender__in=genders,
                profile__birth_date__range=(lo_date, hi_date),
                profile__interest__in=interests,
            )
            .exclude(pk=req.user.pk)
            .difference(invalid_users)
        )

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
        """Gets a list of matches

        Query params:
        amount
          max amount of matches to return.
        minAge
          minimum age.
        maxAge
          maxiumum age.
        genders
          list of genders.
        interests
          list of interest IDs.
        """
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
    serializer_class = AccountSerializer

    def get_object(self):
        return self.request.user
