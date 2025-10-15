from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status


class MachineHistoryViewTest(TestCase):
    @patch("machines.views.get_services_by_node")
    def test_detail_ok(self, mock_get_services):
        mock_get_services.return_value = [{"name": "service1"}]
        client = APIClient()
        response = client.get(reverse("machine-history-detail", args=["node1"]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["name"], "service1")

    @patch("machines.views.get_services_by_node", side_effect=Exception("Consul error"))
    def test_detail_error_from_consul(self, mock_get_services):
        client = APIClient()
        response = client.get(reverse("machine-history-detail", args=["node1"]))
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

    def test_detail_invalid_node(self):
        client = APIClient()
        response = client.get(reverse("machine-history-detail", args=["no_such_node"]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
