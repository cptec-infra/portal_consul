from celery import shared_task
import datetime
import logging
from .consul_client import save_history

logger = logging.getLogger(__name__)

@shared_task
def task_save_history(*args, **kwargs):
    return save_history()

