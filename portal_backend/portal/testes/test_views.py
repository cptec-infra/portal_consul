from django.test import TestCase
from unittest.mock import patch

class PortalViewsIntegrationTest(TestCase):
    @patch("consulviewer.views.get_nodes", return_value=[{"name": "node1"}])
    def test_nodes_view_returns_data(self, mock_get_nodes):
        response = self.client.get("/api/nodes/")
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"nodes": [{"name": "node1"}]})

    @patch("consulviewer.views.get_services", return_value=[{"service": "s1"}])
    def test_servicos_view_returns_data(self, mock_get_services):
        response = self.client.get("/api/servicos/")
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [{"service": "s1"}])
