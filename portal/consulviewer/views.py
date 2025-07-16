from django.shortcuts import render
from .consul_client import get_nodes, get_detailed_services, get_services, group_by_node
from portal.mongo_client import history_collection
import datetime

def home(request):
    nodes = get_nodes()
    print('nodes:> ', nodes)
    return render(request, 'consulviewer/home.html', {'nodes': nodes})

def servicos(request):
    services = get_detailed_services()
    servicos_agrupados = group_by_node(services)
    servicos_agrupados = dict(servicos_agrupados) 
    return render(request, "consulviewer/servicos.html", {"servicos_agrupados": servicos_agrupados
    })

def history_event(event, level="INFO"):
    history = {
        "event": event,
        "level": level,
        "timestamp": datetime.datetime.utcnow()
    }
    history_collection.insert_one(history)