from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.UserLoginView.as_view()),
    path("register/", views.UserRegistrationView.as_view()),
    path("logout/", views.UserLogoutView.as_view()),
    path("deleteaccount/", views.UserAccountDeleteView.as_view()),
    path("videos/", views.VideoListCreate.as_view()),
    path("video/<int:sender>/", views.VideoRetrieveView.as_view()),
    path("intro/<int:profile_id>/", views.IntroVideoRetrieveView.as_view()),
    path("matches/", views.Matches.as_view({"get": "list", "put": "partial_update"})),
    path("profiles/<int:user_id>/", views.PenpalProfileRetrieveView.as_view()),
    path("profile/", views.ProfileRetrieveUpdateView.as_view()),
    path("privacy/", views.PrivacyRetrieveUpdateView.as_view()),
    path("interests/", views.InterestRetrieveView.as_view()),
    # When we get into matching with real data,
    # let's discuss if this needs to be broken into
    # multiple endpoints - Michael
    path("mail/", views.MailListView.as_view()),
    path("mailviewed/<int:video_id>/", views.MailUpdateView.as_view()),
    path("reports/", views.Reports.as_view()),
    path("accounts/", views.Accounts.as_view()),
    path("user/", views.UserAuthView.as_view()),
    path("contact/", views.ContactUs.as_view()),
    path("feedback/", views.Feedback.as_view()),
    path("forgotpassword/", views.UserForgotPassword.as_view()),
    path("changepassword/", views.UserChangePassword.as_view()),
    path(
        "verification/<uidb64>/<token>",
        views.UserVerificationCode.as_view(),
        name="activate",
    ),
]
