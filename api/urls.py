from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.UserLoginView.as_view()),
    path("register/", views.UserRegistrationView.as_view()),
    path("logout/", views.UserLogoutView.as_view()),
    path("deleteaccount/", views.UserAccountDeleteView.as_view()),
    path("videos/", views.VideoListCreate.as_view()),
    path("video/<int:sender>/", views.VideoRetrieveView.as_view()),
    path("match/", views.Matches.as_view()),
    path("profile/", views.ProfileView.as_view()),
    path("report/", views.Reports.as_view()),
]
