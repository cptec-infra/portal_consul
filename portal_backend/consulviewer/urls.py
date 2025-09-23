from django.urls import path
from .views import MonitoringView

urlpatterns = [
    path('monitoring/', MonitoringView.as_view(), name='monitoring'),
]