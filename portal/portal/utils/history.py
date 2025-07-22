import datetime
from portal.producer_kafka import publish_event

def history_event(event, level="INFO"):
    event_data = {
        "event": event,
        "level": level,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event(event_data)
