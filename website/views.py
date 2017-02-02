from django.shortcuts import render


def walk01(request):
    return render(request, 'walk/walk01.html')


def index(request):
    return render(request, 'index.html')
