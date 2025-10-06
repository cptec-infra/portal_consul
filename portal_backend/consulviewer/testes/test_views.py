from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch

class SimpleViewsTest(TestCase):
    @patch("consulviewer.views.get_nodes", return_value=[{"name": "node1"}])
    def test_home(self, mock_get_nodes):
        response = self.client.get(reverse("api_nodes"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"nodes": [{"name": "node1"}]})

    @patch("consulviewer.views.get_services", return_value=[{"name": "svc1"}])
    def test_servicos(self, mock_get_services):
        response = self.client.get(reverse("api_servicos"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{"name": "svc1"}])