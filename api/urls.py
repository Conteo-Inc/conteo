from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.UserLoginView.as_view()),
    path("register/", views.UserRegistrationView.as_view()),
    path("logout/", views.UserLogoutView.as_view()),
    path("video/", views.VideoListCreate.as_view()),
    path("match/", views.Matches.as_view()),
    path("profile/", views.UserProfileView.as_view()),
]
