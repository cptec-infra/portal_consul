from collections import defaultdict
from datetime import datetime
import re
from pymongo import DESCENDING
from portal.mongo_client import history_collection
import os
import requests
import hashlib
import json

CONSUL_HOST = os.getenv("CONSUL_HOST")
CONSUL_PORT = os.getenv("CONSUL_PORT")
CONSUL_TOKEN = os.getenv("CONSUL_TOKEN")
BASE_URL = f"http://{CONSUL_HOST}:{CONSUL_PORT}"
HEADERS = {"X-Consul-Token": CONSUL_TOKEN} if CONSUL_TOKEN else {}


def get_nodes():
    try:
        response = requests.get(f"{BASE_URL}/v1/catalog/nodes", headers=HEADERS)
        response.raise_for_status()
        nodes_data = response.json()

        nodes = []

        for node in nodes_data:
            nodes.append({
                "name": node.get("Node"),
                "address": node.get("Address"),
                "datacenter": node.get("Datacenter"),
                "version": node.get("Meta", {}).get("consul-version", "N/A"),
            })

        return nodes

    except requests.RequestException as e:
        print(f"Erro ao buscar nodes do Consul: {e}")
        return []

def get_services():
    try:
        services_response = requests.get(f"{BASE_URL}/v1/catalog/services")
        services_response.raise_for_status()
        services = services_response.json()

        detailed_services = []

        for service_name in services:
            health_resp = requests.get(f"{BASE_URL}/v1/health/service/{service_name}")
            if health_resp.status_code != 200:
                continue

            for entry in health_resp.json():
                checks = entry.get("Checks", [])
                status = "unknown"

                if all(check["Status"] == "passing" for check in checks):
                    status = "passing"
                elif any(check["Status"] == "critical" for check in checks):
                    status = "critical"
                elif any(check["Status"] == "warning" for check in checks):
                    status = "warning"

                detailed_services.append({
                    "name": entry["Service"]["Service"],
                    "id": entry["Service"]["ID"],
                    "tags": entry["Service"]["Tags"],
                    "address": entry["Node"]["Address"],    
                    "port": entry["Service"]["Port"],
                    "datacenter": entry["Node"]["Datacenter"],
                    "node": entry["Node"]["Node"],          
                    "status": status,
                })

        return detailed_services

    except requests.RequestException as e:
        print(f"Erro ao acessar o Consul: {e}")
        return []

    except requests.RequestException as e:
        print(f"Erro ao consultar Consul: {e}")
        return []
    

def get_services_by_node(node_name: str):
    try:
        health_resp = requests.get(f"{BASE_URL}/v1/health/node/{node_name}")
        health_resp.raise_for_status()
        node_services_checks = health_resp.json()
        
        services_map = {}
        host_metrics = {}

        # Extrai métricas do host (uma vez)
        for entry in node_services_checks:
            output_text = entry.get("Output", "")
            if "machine_cpu_cores" in output_text:
                patterns = {
                    "machine_cpu_cores": r"machine_cpu_cores.*}\s+([0-9.e\+]+)",
                    "machine_memory_bytes": r"machine_memory_bytes.*}\s+([0-9.e\+]+)",
                    "machine_swap_bytes": r"machine_swap_bytes.*}\s+([0-9.e\+]+)",
                    "node_uname_info": r"node_uname_info\{([^}]+)\}\s+1"
                }
                for key, pattern in patterns.items():
                    m = re.search(pattern, output_text)
                    if m:
                        if key == "node_uname_info":
                            labels = {}
                            for kv in m.group(1).split(","):
                                k, v = kv.split("=", 1)
                                labels[k.strip()] = v.strip().strip('"')
                            host_metrics[key] = labels
                        else:
                            host_metrics[key] = float(m.group(1))
                break

        # Monta mapa de serviços
        for entry in node_services_checks:
            service_id = entry.get("ServiceID", "")
            if not service_id:
                continue
            if service_id not in services_map:
                services_map[service_id] = {
                    "ServiceName": entry.get("ServiceName"),
                    "ServiceID": entry.get("ServiceID"),
                    "ServiceTags": entry.get("ServiceTags", []),
                    "ServiceAddress": entry.get("ServiceAddress"),
                    "ServicePort": entry.get("ServicePort"),
                    "Node": entry.get("Node"),
                    "Datacenter": entry.get("Datacenter"),
                    "Address": entry.get("Address"),
                    "Checks": [],
                    "Output": entry.get("Output", "")
                }
            services_map[service_id]["Checks"].append(entry)

        detailed_services = []
        for service_id, service_info in services_map.items():
            checks = service_info["Checks"]
            status = "unknown"
            if all(check["Status"] == "passing" for check in checks):
                status = "passing"
            elif any(check["Status"] == "critical" for check in checks):
                status = "critical"
            elif any(check["Status"] == "warning" for check in checks):
                status = "warning"

            detailed_services.append({
                "name": service_info.get("ServiceName"),
                "id": service_info.get("ServiceID"),
                "tags": service_info.get("ServiceTags"),
                "node": service_info.get("Node"),
                "status": status,
                "metrics": host_metrics,
                "output": service_info.get("Output"),
            })

        return detailed_services


    except requests.RequestException as e:
        print(f"Erro ao consultar Consul para node {node_name}: {e}")
        return []


def get_detailed_services():
    catalog_url = f"{BASE_URL}/v1/catalog/services"
    try:
        catalog_response = requests.get(catalog_url, headers=HEADERS, timeout=5)
        catalog_response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao consultar catálogo: {e}")
        return []

    services = catalog_response.json()
    detailed = []

    for service_name in services.keys():
        health_url = f"{BASE_URL}/v1/health/service/{service_name}"
        try:
            health_response = requests.get(health_url, headers=HEADERS, timeout=5)
            health_response.raise_for_status()
        except requests.RequestException as e:
            print(f"Erro ao consultar {service_name}: {e}")
            continue

        for entry in health_response.json():
            node = entry["Node"]
            service = entry["Service"]
            checks = entry["Checks"]

            statuses = [check["Status"].lower() for check in checks]

            if any(status == "critical" for status in statuses):
                overall_status = "critical"
            elif any(status == "warning" for status in statuses):
                overall_status = "warning"
            elif all(status == "passing" for status in statuses):
                overall_status = "passing"
            else:
                overall_status = "unknown"

            detailed.append({
                "name": service["Service"],
                "id": service["ID"],
                "address": service["Address"],
                "port": service["Port"],
                "tags": service.get("Tags", []),
                "meta": service.get("Meta", {}),
                "kind": service.get("Kind", "standard"),
                "weights": service.get("Weights", {}),
                "enable_tag_override": service.get("EnableTagOverride", False),
                "node": node["Node"],
                "node_address": node["Address"],
                "datacenter": node.get("Datacenter", "desconhecido"),
                "create_index": service.get("CreateIndex"),
                "modify_index": service.get("ModifyIndex"),
                "status": overall_status,  
                "checks": [
                    {
                        "name": check["Name"],
                        "status": check["Status"], 
                    } for check in checks
                ]
            })

    return detailed

def group_by_node(servicos):
    group = defaultdict(list)

    for svc in servicos:
        key = (svc["node"], svc["node_address"], svc["datacenter"])
        group[key].append(svc)

    return group


def generation_hash(servicos):
    """Gera um hash SHA256 do estado atual dos serviços"""
    json_str = json.dumps(servicos, sort_keys=True)
    return hashlib.sha256(json_str.encode('utf-8')).hexdigest()

def save_history():
    dados = get_detailed_services()
    agrupado = group_by_node(dados)


    for (node, node_address, datacenter), servicos in agrupado.items():
        hash_atual = generation_hash(servicos)

        ultimo = history_collection.find_one(
            {"node": node, "node_address": node_address, "datacenter": datacenter},
            sort=[("timestamp", DESCENDING)]
        )

        if not ultimo or ultimo.get("hash") != hash_atual:
            doc = {
                "timestamp": datetime.utcnow(),
                "node": node,
                "node_address": node_address,
                "datacenter": datacenter,
                "services": servicos,
                "hash": hash_atual,
            }
            history_collection.insert_one(doc)
            print(f"[Mongo] Novo estado salvo para: {node}")
        else:
            print(f"[Mongo] Estado inalterado para: {node}")
