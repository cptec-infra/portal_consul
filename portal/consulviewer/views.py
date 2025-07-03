from django.shortcuts import render
from .consul_client import get_nodes, get_detailed_services

def home(request):
    nodes = get_nodes()
    print('nodes:> ', nodes)
    return render(request, 'consulviewer/home.html', {'nodes': nodes})

def servicos(request):
    services = get_detailed_services()
    return render(request, 'consulviewer/servicos.html', {'services': services})