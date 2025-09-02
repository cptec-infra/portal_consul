from django.contrib import admin
from django.urls import path, include
from consulviewer import views
from machines import views as machine_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/nodes/', views.home, name='api_nodes'),
    path('api/servicos/', views.servicos, name='api_servicos'),
    path('api/', include('machines.urls')),
    path('api/', include('freeipa.urls')),
    path("api/grafana/<path:grafana_path>", machine_views.GrafanaProxyView.grafana_proxy, name="grafana_proxy"),
]