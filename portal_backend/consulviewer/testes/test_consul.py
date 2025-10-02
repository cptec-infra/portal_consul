from django.test import TestCase
from unittest.mock import patch, MagicMock
from consulviewer.consul_client import get_nodes, get_services, get_services_by_node, save_history

import requests


class ConsulClientTest(TestCase):
    @patch("consulviewer.consul_client.requests.get")
    def test_get_nodes_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = [
            {"Node": "node1", "Address": "10.0.0.1", "Datacenter": "dc1", "Meta": {"consul-version": "1.14"}}
        ]

        result = get_nodes()
        expected = [
            {"name": "node1", "address": "10.0.0.1", "datacenter": "dc1", "version": "1.14"}
        ]
        self.assertEqual(result, expected)

    @patch("consulviewer.consul_client.requests.get")
    def test_get_nodes_failure(self, mock_get):
        mock_get.side_effect = requests.exceptions.RequestException("Erro no Consul")
        result = get_nodes()
        self.assertEqual(result, [])

    @patch("consulviewer.consul_client.requests.get")
    def test_get_services_success(self, mock_get):
        mock_get.side_effect = [
            MagicMock(status_code=200, json=MagicMock(return_value={"service1": [], "service2": []})),
            MagicMock(status_code=200, json=MagicMock(return_value=[
                {
                    "Node": {"Node": "node1", "Address": "10.0.0.1", "Datacenter": "dc1"},
                    "Service": {"Service": "service1", "ID": "s1", "Tags": [], "Port": 8080},
                    "Checks": [{"Status": "passing"}]
                }
            ])),
            MagicMock(status_code=200, json=MagicMock(return_value=[]))
        ]

        result = get_services()
        expected = [
            {
                "name": "service1",
                "id": "s1",
                "tags": [],
                "address": "10.0.0.1",
                "port": 8080,
                "datacenter": "dc1",
                "node": "node1",
                "status": "passing"
            }
        ]
        self.assertEqual(result, expected)

    @patch("consulviewer.consul_client.requests.get")
    def test_get_services_failure(self, mock_get):
        mock_get.side_effect = requests.exceptions.RequestException("Erro no Consul")
        result = get_services()
        self.assertEqual(result, [])

    @patch("consulviewer.consul_client.requests.get")
    def test_get_services_by_node_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = [
            {
                "ServiceID": "s1",
                "ServiceName": "service1",
                "ServiceTags": [],
                "ServiceAddress": "10.0.0.1",
                "ServicePort": 8080,
                "Node": "node1",
                "Datacenter": "dc1",
                "Address": "10.0.0.1",
                "Output": "",
                "Status": "passing",  
            }
        ]

        result = get_services_by_node("node1")
        expected = [
            {
                "name": "service1",
                "id": "s1",
                "tags": [],
                "node": "node1",
                "status": "passing",
                "metrics": {},
                "output": "",
                
            }
        ]
        self.assertEqual(result, expected)

    @patch("consulviewer.consul_client.requests.get")
    def test_get_services_by_node_failure(self, mock_get):
        mock_get.side_effect = requests.exceptions.RequestException("Erro no Consul")
        result = get_services_by_node("node1")
        self.assertEqual(result, [])
