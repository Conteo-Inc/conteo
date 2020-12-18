from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token
from . import views

urlpatterns = [
    path('api/video/', views.VideoListCreate.as_view()),
    path('api/token-auth/', obtain_jwt_token),
    path('api/current_user/', views.current_user),
    path('api/users/', views.UserList.as_view())
]