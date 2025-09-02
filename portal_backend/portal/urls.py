from django.contrib import admin
from django.urls import path, include, re_path
from consulviewer import views
from machines import views as machine_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/nodes/', views.home, name='api_nodes'),
    path('api/servicos/', views.servicos, name='api_servicos'),
    path('api/', include('machines.urls')),
    path('api/', include('freeipa.urls')),
    re_path(r'^api/grafana/(?P<grafana_path>.*)$', machine_views.GrafanaProxyView.as_view(), name='grafana_proxy'),
]