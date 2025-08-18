from django.contrib import admin
from django.urls import path, include
from consulviewer import views
from freeipa import views as freeipa_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/nodes/', views.home, name='api_nodes'),
    path('api/servicos/', views.servicos, name='api_servicos'),
    path('api/servidores/', views.servers_list, name='api_servidores'),
    path('api/servidores/detalhes/', views.servers_details, name='api_servidores_detalhes'),
    path('api/', include('machines.urls')),

    path('api/servidores/exportar/excel/', views.export_excel, name='api_export_excel'),
    path('api/servidores/exportar/pdf/', views.export_pdf, name='api_export_pdf'),
    path("api/freeipa/users", freeipa_views.users_all, name="users_all"), 
    path("api/freeipa/groups", freeipa_views.groups_all, name="groups_all"),
]