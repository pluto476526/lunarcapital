# dash/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db import transaction
import logging

logger = logging.getLogger(__name__)


def index_view(request):
    context = {}
    return render(request, "dash/index.html", context)


def market_selector_view(request):
   
    context = {
    }
    return render(request, "dash/pending_listings.html", context)


def posted_listings_view(request):
    context = {
    }
    return render(request, "dash/posted_listings.html", context)


def user_viewings_view(request):
    context = {
    }
    return render(request, "dash/user_viewings.html", context)


def manage_viewings_view(request):
    context = {
    }
    return render(request, "dash/manage_viewings.html", context)


def favourites_view(request):
    context = {
    }
    return render(request, "dash/favourites.html", context)


def notifications_view(request):
    context = {
    }
    return render(request, "dash/notifications.html", context)


def faqs_view(request):
    context = {}
    return render(request, "dash/faqs.html", context)
