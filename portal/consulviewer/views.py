from django.shortcuts import render
from .consul_client import get_nodes, get_detailed_services, get_services, group_by_node
from portal.mongo_client import history_collection
from django.http import HttpResponse
import openpyxl
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import datetime
from django.core.paginator import Paginator
from django.utils.http import urlencode

SERVIDORES_DATA = [
  {"id": 1, "nome": "vm-database-01", "ip": "172.27.1.10", "sistema_operacional": "Ubuntu 22.04", "status": "ativo", "descricao": "Servidor de banco de dados PostgreSQL rodando em VM dedicada"},
  {"id": 2, "nome": "vm-api-01", "ip": "172.27.1.11", "sistema_operacional": "Debian 11", "status": "ativo", "descricao": "Servidor de API principal com Node.js e PM2"},
  {"id": 3, "nome": "vm-monitoramento", "ip": "172.27.1.12", "sistema_operacional": "CentOS 8", "status": "ativo", "descricao": "Servidor com Prometheus, Grafana e exporters instalados"},
  {"id": 4, "nome": "vm-testes-integration", "ip": "172.27.1.20", "sistema_operacional": "Ubuntu 20.04", "status": "inativo", "descricao": "Ambiente de testes de integração - desligado temporariamente"},
  {"id": 5, "nome": "vm-backup-01", "ip": "172.27.1.30", "sistema_operacional": "Rocky Linux 9", "status": "ativo", "descricao": "Servidor responsável por backup automático diário"},
]

def home(request):
  nodes = get_nodes()
  return render(request, 'consulviewer/home.html', {'nodes': nodes})

def servicos(request):
  services = get_detailed_services()
  servicos_agrupados = group_by_node(services)
  servicos_agrupados = dict(servicos_agrupados) 
  return render(request, "consulviewer/servicos.html", {"servicos_agrupados": servicos_agrupados
  })

def servers_list(request):
    servidores = SERVIDORES_DATA

    search = request.GET.get('search', '').lower()
    status_filter = request.GET.get('status', '')
    sistema_filter = request.GET.get('sistema', '')

    if search:
        servidores = [s for s in servidores if search in s["nome"].lower() or search in s["ip"] or search in s["sistema_operacional"].lower()]

    if status_filter:
        servidores = [s for s in servidores if s["status"] == status_filter]

    if sistema_filter:
        servidores = [s for s in servidores if s["sistema_operacional"] == sistema_filter]

    if request.GET.get('export') == 'excel':
        return export_excel(servidores)
    elif request.GET.get('export') == 'pdf':
        return export_pdf(servidores)

    sistemas_unicos = sorted(set(s['sistema_operacional'] for s in SERVIDORES_DATA))
    return render(request, "servers/servers_list.html", {
        "servidores": servidores,
        "sistemas": sistemas_unicos,
    })

def servers_details(request):
  servers = SERVIDORES_DATA    
  return render(request, "servers/server_detail.html", {"servidor": servers})


def export_excel(servidores):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["Nome", "IP", "Sistema", "Status", "Descrição"])
    for s in servidores:
        ws.append([s["nome"], s["ip"], s["sistema_operacional"], s["status"], s["descricao"]])

    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=servidores.xlsx'
    return response


def export_pdf(servidores):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    y = height - 50
    p.setFont("Helvetica", 12)
    p.drawString(50, y, "Lista de Servidores")

    y -= 30
    for s in servidores:
        texto = f"{s['nome']} - {s['ip']} - {s['sistema_operacional']} - {s['status']}"
        p.drawString(50, y, texto)
        y -= 20
        if y < 50:
            p.showPage()
            y = height - 50

    p.save()
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=servidores.pdf'
    return response

def history_event(event, level="INFO"):
  history = {
      "event": event,
      "level": level,
      "timestamp": datetime.datetime.utcnow()
  }
  history_collection.insert_one(history)