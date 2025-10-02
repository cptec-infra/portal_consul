from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status


class MachineDetailViewTest(TestCase):
    @patch("machines.views.get_services_by_node")
    def test_detail_ok(self, mock_get_services):
        
        mock_get_services.return_value = [
            {
                "name": "web",
                "id": "srv1",
                "tags": ["prod"],
                "node": "node1",
                "status": "passing",
                "metrics": {"machine_cpu_cores": 4},
                "output": "machine_cpu_cores 4\nmachine_memory_bytes 8192\n",
            }
        ]

        client = APIClient()
        response = client.get(reverse("machine-history-detail", args=["node1"]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "web")
        self.assertEqual(response.data[0]["status"], "passing")
        self.assertIn("metrics", response.data[0])

    @patch("machines.views.get_services_by_node", side_effect=Exception("Consul error"))
    def test_detail_error_from_consul(self, mock_get_services):
        client = APIClient()
        response = client.get(reverse("machine-history-detail", args=["node1"]))
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

    def test_detail_with_invalid_node(self):
        client = APIClient()
        response = client.get(reverse("machine-history-detail", args=["inexistente"]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
