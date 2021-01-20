from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token
from . import views

urlpatterns = [
    path('api/video/', views.VideoListCreate.as_view()),
    path('api/signup/', views.UserRegistrationView.as_view()),
    path('api/login/', views.UserLoginView.as_view()),
    path('api/current_user/', views.UserProfileView.as_view()),
]