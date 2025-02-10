from django.urls import path
from .views import (LoginAPIView, 
                    RegisterAPIView,
                    RetrieveUserAPIView
                    )
urlpatterns = [
    path('login/',LoginAPIView.as_view(),name='login'),
    path('register/',RegisterAPIView.as_view(),name='register'),
    path('profile/',RetrieveUserAPIView.as_view(),name='profile'),
]