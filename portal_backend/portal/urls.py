from django.contrib import admin
from django.urls import path
from consulviewer import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/nodes/', views.home, name='api_nodes'),
    path('api/servicos/', views.servicos, name='api_servicos'),
    path('api/servidores/', views.servers_list, name='api_servidores'),
    path('api/servidores/detalhes/', views.servers_details, name='api_servidores_detalhes'),

    # Exportação
    path('api/servidores/exportar/excel/', views.export_excel, name='api_export_excel'),
    path('api/servidores/exportar/pdf/', views.export_pdf, name='api_export_pdf'),
]