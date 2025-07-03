import os
import requests

CONSUL_HOST = os.getenv("CONSUL_HOST", "localhost")
CONSUL_PORT = os.getenv("CONSUL_PORT", "8500")
BASE_URL = f"http://{CONSUL_HOST}:{CONSUL_PORT}"

def get_nodes():
    try:
        response = requests.get(f"{BASE_URL}/v1/catalog/nodes")
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

        print(nodes)
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

def get_detailed_services():
    catalog_url = f"{BASE_URL}/v1/catalog/services"
    catalog_response = requests.get(catalog_url)
    catalog_response.raise_for_status()
    services = catalog_response.json()

    detailed = []

    for service_name in services.keys():
        health_url = f"{BASE_URL}/v1/health/service/{service_name}?passing=false"
        health_response = requests.get(health_url)
        if health_response.status_code != 200:
            continue

        for entry in health_response.json():
            node = entry["Node"]
            service = entry["Service"]
            checks = entry["Checks"]

            detailed.append({
                "name": service["Service"],
                "id": service["ID"],
                "address": service["Address"],
                "port": service["Port"],
                "tags": service.get("Tags", []),
                "datacenter": node.get("Datacenter", "desconhecido"),
                "node": node["Node"],
                "node_address": node["Address"],
                "checks": [
                    {
                        "name": check["Name"],
                        "status": check["Status"],
                        "output": check["Output"],
                        "type": check["CheckType"] if "CheckType" in check else "N/A"
                    } for check in checks
                ]
            })

    return detailed