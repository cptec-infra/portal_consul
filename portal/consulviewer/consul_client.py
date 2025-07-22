from collections import defaultdict
import datetime
import os
import requests
from portal.producer_kafka import publish_service_status
import logging

logger = logging.getLogger(__name__)

CONSUL_HOST = os.getenv("CONSUL_HOST")
CONSUL_PORT = os.getenv("CONSUL_PORT")
BASE_URL = f"http://{CONSUL_HOST}:{CONSUL_PORT}"

def get_nodes():
    try:
        response = requests.get(f"{BASE_URL}/v1/catalog/nodes", timeout=10)
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
        
        logger.info(f"Encontrados {len(nodes)} nodes no Consul")
        return nodes
        
    except requests.RequestException as e:
        logger.error(f"Erro ao buscar nodes do Consul: {e}")
        return []

def get_services():
    try:
        services_response = requests.get(f"{BASE_URL}/v1/catalog/services", timeout=10)
        services_response.raise_for_status()
        services = services_response.json()
        
        detailed_services = []
        for service_name in services:
            health_resp = requests.get(f"{BASE_URL}/v1/health/service/{service_name}", timeout=10)
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
        logger.error(f"Erro ao acessar o Consul: {e}")
        return []

def get_detailed_services():
    catalog_url = f"{BASE_URL}/v1/catalog/services"
    
    try:
        catalog_response = requests.get(catalog_url, timeout=10)
        catalog_response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Erro ao consultar catálogo: {e}")
        return []
    
    services = catalog_response.json()
    detailed = []
    
    for service_name in services.keys():
        health_url = f"{BASE_URL}/v1/health/service/{service_name}"
        
        try:
            health_response = requests.get(health_url, timeout=10)
            health_response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Erro ao consultar {service_name}: {e}")
            continue
        
        for entry in health_response.json():
            node = entry["Node"]
            service = entry["Service"]
            checks = entry["Checks"]
            
            # Determinar status geral
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
                "address": service.get("Address", ""),
                "port": service.get("Port", 0),
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
                        "output": check.get("Output", ""),
                        "type": check.get("CheckType", "N/A")
                    } for check in checks
                ]
            })
            
            # Enviar status para Kafka usando função específica
            timestamp = datetime.datetime.utcnow().isoformat()
            success = publish_service_status(
                service_name=service["Service"],
                node_name=node["Node"], 
                status=overall_status,
                timestamp=timestamp
            )
            
            if success:
                logger.debug(f"Status enviado para Kafka: {service['Service']} @ {node['Node']} = {overall_status}")
            else:
                logger.warning(f"Falha ao enviar status para Kafka: {service['Service']} @ {node['Node']}")
    
    logger.info(f"Processados {len(detailed)} serviços detalhados")
    return detailed

def group_by_node(servicos):
    """Agrupa serviços por node"""
    group = defaultdict(list)
    for svc in servicos:
        key = (svc["node"], svc["node_address"], svc["datacenter"])
        group[key].append(svc)
    return group