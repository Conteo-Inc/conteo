from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.UserLoginView.as_view()),
    path("register/", views.UserRegistrationView.as_view()),
    path("logout/", views.UserLogoutView.as_view()),
    path("deleteaccount/", views.UserAccountDeleteView.as_view()),
    path("video/", views.VideoListCreate.as_view()),
    path("match/", views.Matches.as_view()),
    path("profile/", views.ProfileView.as_view()),
    # When we get into matching with real data,
    # let's discuss if this needs to be broken into
    # multiple endpoints - Michael
    path("mail/", views.VideoListCreate.as_view()),
    path("report/", views.Reports.as_view()),
]
