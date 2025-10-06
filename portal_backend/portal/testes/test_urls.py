from django.test import SimpleTestCase
from django.urls import reverse, resolve
from consulviewer import views as consul_views
from machines import views as machine_views

class PortalUrlsTest(SimpleTestCase):
    def test_api_nodes_url_resolves(self):
        url = reverse("api_nodes")
        self.assertEqual(url, "/api/nodes/")
        self.assertEqual(resolve(url).func, consul_views.home)

    def test_api_servicos_url_resolves(self):
        url = reverse("api_servicos")
        self.assertEqual(url, "/api/servicos/")
        self.assertEqual(resolve(url).func, consul_views.servicos)

    def test_grafana_proxy_url_resolves(self):
        url = "/api/grafana/somepath/"
        view = resolve(url)
        self.assertEqual(view.func.view_class, machine_views.GrafanaProxyView)
