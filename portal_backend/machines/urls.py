from django.urls import path
from .views import MachineHistoryView, MachineDetailView

urlpatterns = [
    path('history/<str:node>/', MachineHistoryView.as_view(), name='machine-history'),
    path('history/detail/<str:node>/', MachineDetailView.as_view(), name='machine-history-detail'),

]
