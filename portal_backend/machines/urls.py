from django.urls import path
from .views import MachineHistoryView

urlpatterns = [
    path('history/<str:node>/', MachineHistoryView.as_view(), name='machine-history'),
]
