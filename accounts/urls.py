# /accounts/urls.py
# pkibuka@milky-way.space

from django.urls import path
from accounts import views


urlpatterns = [
    path("register/", views.register_view, name="register"),
    path("sign-in/", views.signin_view, name="signin"),
]
