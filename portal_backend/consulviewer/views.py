import datetime
from django.http import JsonResponse
from portal.mongo_client import history_collection
from .consul_client import (get_nodes,get_services)

def home(request):
    nodes = get_nodes()
    return JsonResponse({'nodes': nodes})

def servicos(request):
    services = get_services()
    return JsonResponse(services, safe=False)
