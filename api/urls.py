from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token
from . import views

urlpatterns = [
    path("video/", views.VideoListCreate.as_view()),
    path("login/", views.UserLoginView.as_view()),
    path("current_user/", views.UserProfileView.as_view()),
    path("register/", views.UserRegistrationView.as_view()),
    path("match/", views.Matches.as_view()),
]
