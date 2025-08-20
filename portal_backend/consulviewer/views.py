import datetime
from django.http import JsonResponse
from portal.mongo_client import history_collection
from .consul_client import (get_nodes,get_services,save_history)

SERVIDORES_DATA = [
    {"id": 1, "nome": "vm-database-01", "ip": "172.27.1.10", "sistema_operacional": "Ubuntu 22.04", "status": "ativo", "descricao": "Servidor de banco de dados PostgreSQL rodando em VM dedicada"},
    {"id": 2, "nome": "vm-api-01", "ip": "172.27.1.11", "sistema_operacional": "Debian 11", "status": "ativo", "descricao": "Servidor de API principal com Node.js e PM2"},
    {"id": 3, "nome": "vm-monitoramento", "ip": "172.27.1.12", "sistema_operacional": "CentOS 8", "status": "ativo", "descricao": "Servidor com Prometheus, Grafana e exporters instalados"},
    {"id": 4, "nome": "vm-testes-integration", "ip": "172.27.1.20", "sistema_operacional": "Ubuntu 20.04", "status": "inativo", "descricao": "Ambiente de testes de integração - desligado temporariamente"},
    {"id": 5, "nome": "vm-backup-01", "ip": "172.27.1.30", "sistema_operacional": "Rocky Linux 9", "status": "ativo", "descricao": "Servidor responsável por backup automático diário"},
]

def home(request):
    nodes = get_nodes()
    return JsonResponse({'nodes': nodes})


def servicos(request):
    services = get_services()
    return JsonResponse(services, safe=False)


def history_event(event, level="INFO"):
    history = {
        "event": event,
        "level": level,
        "timestamp": datetime.datetime.utcnow()
    }
    history_collection.insert_one(history)

def registry_history(request):
    save_history()
    return JsonResponse({"message": "Estado registrado (se diferente)."})