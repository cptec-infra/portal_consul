from kafka import KafkaProducer
import json
import os
import logging

logger = logging.getLogger(__name__)

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "portal_kafka:9092")
TOPIC_NAME = os.getenv("KAFKA_TOPIC", "status_topic")

# Cache para manter uma única instância do producer
_producer_instance = None

def get_producer():
    """Cria ou retorna a instância do producer Kafka"""
    global _producer_instance
    
    if _producer_instance is None:
        try:
            logger.info(f"Inicializando producer Kafka: {KAFKA_BROKER}")
            _producer_instance = KafkaProducer(
                bootstrap_servers=[KAFKA_BROKER],
                value_serializer=lambda v: json.dumps(v, ensure_ascii=False).encode('utf-8'),
                key_serializer=lambda k: k.encode('utf-8') if k else None,
                retries=5,
                retry_backoff_ms=300,
                request_timeout_ms=30000,
                acks='all'  # Garantir que a mensagem foi recebida
            )
            logger.info("Producer Kafka inicializado com sucesso")
        except Exception as e:
            logger.error(f"Erro ao inicializar o producer Kafka: {e}")
            _producer_instance = None
    
    return _producer_instance

def publish_event(event_data, topic=None):
    """Publica um evento no Kafka"""
    if topic is None:
        topic = TOPIC_NAME
        
    producer = get_producer()
    if not producer:
        logger.warning("Producer Kafka não está inicializado")
        return False
    
    try:
        # Adicionar metadados se não existirem
        if 'timestamp' not in event_data:
            from datetime import datetime
            event_data['timestamp'] = datetime.utcnow().isoformat()
        
        logger.debug(f"Enviando evento para tópico {topic}: {event_data}")
        
        # Enviar mensagem
        future = producer.send(topic, value=event_data)
        # Aguardar confirmação com timeout
        result = future.get(timeout=10)
        
        logger.info(f"Evento enviado com sucesso para {topic}. Offset: {result.offset}")
        return True
        
    except Exception as e:
        logger.error(f"Falha ao publicar evento no Kafka: {e}")
        return False

def publish_service_status(service_name, node_name, status, timestamp=None):
    """Publica status específico de serviço"""
    from datetime import datetime
    
    if timestamp is None:
        timestamp = datetime.utcnow().isoformat()
    
    event_data = {
        "service": service_name,
        "node": node_name,
        "status": status,
        "timestamp": timestamp,
        "type": "service_status"
    }
    
    return publish_event(event_data)

def close_producer():
    """Fecha a conexão do producer"""
    global _producer_instance
    if _producer_instance:
        try:
            _producer_instance.flush()
            _producer_instance.close()
            logger.info("Producer Kafka fechado")
        except Exception as e:
            logger.error(f"Erro ao fechar producer: {e}")
        finally:
            _producer_instance = None