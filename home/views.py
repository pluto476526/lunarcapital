# /home/views.py
# pkibuka@milky-way.space


from django.shortcuts import render


def index_view(request):
    context = {}
    return render(request, "home/index.html", context)
