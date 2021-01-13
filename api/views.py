from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Video
from .serializers import UserSerializer, UserSerializerWithToken, VideoSerializer


@api_view(["GET"])
def current_user(request):
    """
    Determine the current user via token and return data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoListCreate(generics.ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class Matches(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Return a QuerySet of Users that can be served to the request user
        as a match.
        """
        req_user = self.request.user  # The user that is requesting their matches
        return User.objects.filter(
            # Users not in MatchStatus table
            Q(matchstatus_hi__isnull=True, matchstatus_lo__isnull=True)
            | (
                # user_hi = req_user AND
                # user_hi has not responded and user_lo has not declined
                Q(matchstatus_lo__user_hi=req_user)
                & Q(matchstatus_lo__user_hi_response__isnull=True)
                & ~Q(matchstatus_lo__user_lo_response=False)
            )
            | (
                # user_lo = req_user AND
                # user_lo has not responded and user_hi has not declined
                Q(matchstatus_hi__user_lo=req_user)
                & Q(matchstatus_hi__user_lo_response__isnull=True)
                & ~Q(matchstatus_hi__user_hi_response=False)
            )
        )
