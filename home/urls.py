# /home/urls.py
# pkibuka@milky-way.space

from django.urls import path
from home import views

urlpatterns = [
    path("", views.index_view, name="home"),
]
