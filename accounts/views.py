# /lunarcapital/views.py
# pkibuka@milky-way.space

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, models, forms
from django.contrib import messages
from accounts.forms import UserRegForm, AuthForm
from accounts.models import Profile
import logging

logger = logging.getLogger(__name__)

def register_view(request):
    if request.user.is_authenticated:
        return redirect("home")

    reg_form = UserRegForm(request.POST or None)

    if request.method == "POST" and reg_form.is_valid():
        user = reg_form.save()
        Profile.objects.create(user=user)
        messages.success(request, "Registration succesful. You can now sign in.")
        return redirect("signin")

    context = {
        "reg_form": reg_form,
    }
    return render(request, "accounts/register.html", context)


def signin_view(request):
    if request.user.is_authenticated:
        return redirect("home")

    auth_form = AuthForm(request.POST or None)

    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        logger.debug(f"email: {email}")
        logger.debug(f"pass: {password}")
        user = authenticate(request, email=email, password=password)

        if user:
            login(request, user)
            return redirect("home")
        else:
            messages.error(request, "Invalid credentials. Please try again.")
            return redirect("signin")

    context = {
        "auth_form": auth_form,
    }
    return render(request, "accounts/signin.html", context)

