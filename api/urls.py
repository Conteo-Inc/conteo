from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

from . import views

urlpatterns = [
    path("video/", views.VideoListCreate.as_view()),
    path("token-auth/", obtain_jwt_token),
    path("current_user/", views.current_user),
    path("users/", views.UserList.as_view()),
    path("match/", views.Matches.as_view()),
]
