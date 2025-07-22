from django.contrib import admin
from django.urls import path
from consulviewer import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('servicos/', views.servicos, name='servicos'),
    path('servers_list/', views.servers_list, name='servers_list'),
    path('servers_details/', views.servers_details, name='servers_details'),
    path("servers/exportar/excel/", views.export_excel, name="export_excel"),
    path("servers/exportar/pdf/", views.export_pdf, name="export_pdf"),
]
