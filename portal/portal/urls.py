from django.contrib import admin
from django.urls import path
from consulviewer import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('servicos/', views.servicos, name='servicos'),
    path('servers/', views.servers, name='servers')
]
