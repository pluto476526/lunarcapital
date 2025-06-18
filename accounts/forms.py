from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms


class UserRegForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class AuthForm(forms.Form):
    email = forms.EmailField(required=True)
    password = forms.CharField(label="Password", widget=forms.PasswordInput, required=True)
