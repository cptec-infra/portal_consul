from django.test import TestCase
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient


class GrafanaProxyViewTest(TestCase):
    @patch("machines.views.requests.request")
    def test_grafana_proxy_json(self, mock_request):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.headers = {"Content-Type": "application/json"}
        mock_response.iter_content = lambda chunk_size: [b'{"grafana": "ok"}']
        mock_request.return_value = mock_response

        client = APIClient()
        response = client.get("/api/grafana/test-endpoint")

        self.assertEqual(response.status_code, 200)
        self.assertIn("Access-Control-Allow-Origin", response.headers)

    @patch("machines.views.requests.request")
    def test_grafana_proxy_html_rewrites_links(self, mock_request):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.headers = {"Content-Type": "text/html"}
        mock_response.text = '<html><head><link href="/css/file.css"></head><body><script src="/js/file.js"></script></body></html>'
        mock_request.return_value = mock_response

        client = APIClient()
        response = client.get("/api/grafana/some-dashboard")

        self.assertEqual(response.status_code, 200)
        html = response.content.decode()
        self.assertIn('/api/grafana/', html)
