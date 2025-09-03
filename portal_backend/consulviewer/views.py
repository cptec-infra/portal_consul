import datetime
from django.http import JsonResponse
from portal.mongo_client import history_collection
from .consul_client import (get_nodes,get_services,save_history)
import requests
import re
from typing import Dict, Any
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


PROMETHEUS_URL = "http://150.163.190.19:9090/api/v1/query"

class MonitoringView(APIView):
    def get(self, request):
        try:
            data = {
                "cpu_usage": self.query_prometheus_single(
                    '100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'
                ),
                "memory_usage": self.query_prometheus_single(
                    '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100'
                ),
                "disk_usage": self.query_prometheus_single(
                    '(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100'
                ),
                "running_processes": self.query_prometheus_single("processes"),
                "open_ports": self.query_prometheus_ports("node_netstat_Tcp_ListenLocalPort"),
                "uptime_seconds": self.query_prometheus_single(
                    "node_time_seconds - node_boot_time_seconds"
                ),
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def query_prometheus_single(self, query: str):
        try:
            response = requests.get(PROMETHEUS_URL, params={"query": query}, timeout=10)
            result = response.json()
            if result["status"] == "success" and result["data"]["result"]:
                return float(result["data"]["result"][0]["value"][1])
            return None
        except Exception:
            return None

    def query_prometheus_ports(self, query: str):
        try:
            response = requests.get(PROMETHEUS_URL, params={"query": query}, timeout=10)
            result = response.json()
            if result["status"] == "success" and result["data"]["result"]:
                ports = [
                    int(item["metric"].get("localport", 0))
                    for item in result["data"]["result"]
                ]
                return sorted(list(set(ports)))
            return []
        except Exception:
            return []

# class NodeMetricsView(APIView):
#     def get(self, request, node_name, format=None):
#         metrics = self.get_node_infos_prometheus(node_name)
        
#         if "error" in metrics:
#             return Response(metrics, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         return Response(metrics)
    
#     def get_node_infos_prometheus(self, node_name: str) -> dict:
#         PROMETHEUS_URL = "http://150.163.190.19:9090"
#         node_name_regex = "node_exporter:9100"
        
#         queries = {
#             "cpu_usage": f'100 - (avg by (instance) (rate(node_cpu_seconds_total{{mode="idle", instance=~"{node_name_regex}"}}[5m])) * 100)',
#             "memory_total": f'node_memory_MemTotal_bytes{{instance=~"{node_name_regex}"}}',
#             "memory_free": f'node_memory_MemFree_bytes{{instance=~"{node_name_regex}"}}',
#             "disk_read_bytes": f'rate(node_disk_read_bytes_total{{instance=~"{node_name_regex}"}}[5m])',
#             "disk_write_bytes": f'rate(node_disk_written_bytes_total{{instance=~"{node_name_regex}"}}[5m])',
#             "network_receive_bytes": f'rate(node_network_receive_bytes_total{{instance=~"{node_name_regex}"}}[5m])',
#             "network_transmit_bytes": f'rate(node_network_transmit_bytes_total{{instance=~"{node_name_regex}"}}[5m])',
#             "process_cpu_usage": f'sum by (process) (rate(process_cpu_seconds_total{{instance=~"{node_name_regex}"}}[5m])) * 100',
#             "process_memory_usage": f'sum by (process) (process_resident_memory_bytes{{instance=~"{node_name_regex}"}})',
#         }
        
#         node_data = {
#             "node_name": node_name,
#             "metrics": {}
#         }

#         try:
#             for metric_name, query_string in queries.items():
#                 response = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={"query": query_string})
#                 response.raise_for_status()
#                 data = response.json()
                
#                 if data["status"] == "success" and data["data"]["result"]:
#                     value = data["data"]["result"][0]["value"][1]
#                     node_data["metrics"][metric_name] = value
                    
#             if "memory_total" in node_data["metrics"] and "memory_free" in node_data["metrics"]:
#                 total_mem = float(node_data["metrics"]["memory_total"])
#                 free_mem = float(node_data["metrics"]["memory_free"])
#                 used_mem_percentage = 100 * (1 - (free_mem / total_mem))
#                 node_data["metrics"]["memory_usage"] = f"{used_mem_percentage:.2f}"
            
#             return node_data

#         except requests.RequestException as e:
#             return {"error": f"Erro ao coletar métricas para {node_name}, erro: {e}"}
#         except KeyError as e:
#             return {"error": f"Erro ao processar dados do Prometheus, erro: {e}"}
#         except (IndexError, ValueError) as e:
#             return {"error": f"Dados inesperados do Prometheus, erro: {e}"}



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