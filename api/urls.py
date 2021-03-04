from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.UserLoginView.as_view()),
    path("register/", views.UserRegistrationView.as_view()),
    path("logout/", views.UserLogoutView.as_view()),
    path("deleteaccount/", views.UserAccountDeleteView.as_view()),
    path("videos/", views.VideoListCreate.as_view()),
    path("video/<int:sender>/", views.VideoRetrieveView.as_view()),
    path("matches/", views.Matches.as_view({"get": "list", "put": "partial_update"})),
    path("profile/", views.ProfileView.as_view()),
    path("reports/", views.Reports.as_view()),
    path("user/", views.UserAuthView.as_view()),
]
