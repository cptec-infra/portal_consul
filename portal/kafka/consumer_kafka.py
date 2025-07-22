from kafka import KafkaConsumer
from pymongo import MongoClient
import json
import os
import time
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TOPIC = 'status_topic'

def get_mongo_collection():
    mongo_user = os.getenv("MONGO_INITDB_ROOT_USERNAME")
    mongo_password = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "portal_mongodb")
    mongo_db = os.getenv("MONGO_INITDB_DATABASE")

    logger.info(f"Conectando ao MongoDB: {mongo_host}:27017")
    mongo_url = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:27017/"

    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        client.server_info()
        logger.info("Conexão com MongoDB estabelecida com sucesso")

        db = client[mongo_db]
        collection = db["eventos"]

        collection.create_index([("service", 1), ("node", 1), ("timestamp", 1)], unique=False)
        logger.info("Índices criados no MongoDB")

        return collection
    except Exception as e:
        logger.error(f"Erro ao conectar com MongoDB: {e}")
        raise

def wait_for_kafka():
    while True:
        try:
            logger.info("Tentando conectar ao Kafka...")
            consumer = KafkaConsumer(
                bootstrap_servers=os.getenv("KAFKA_BROKER", "portal_kafka:9092"),
                consumer_timeout_ms=5000
            )
            consumer.close()
            logger.info("Kafka está disponível!")
            break
        except Exception as e:
            logger.warning(f"Kafka ainda não está disponível: {e}")
            time.sleep(10)

def create_consumer():
    group_id = os.getenv("KAFKA_GROUP_ID", "status_group_debug")
    try:
        consumer = KafkaConsumer(
            TOPIC,
            bootstrap_servers=os.getenv("KAFKA_BROKER", "portal_kafka:9092"),
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id=group_id,
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            auto_commit_interval_ms=1000,
        )
        logger.info(f"Consumer criado para o tópico: {TOPIC} com group_id='{group_id}'")
        return consumer
    except Exception as e:
        logger.error(f"Erro ao criar consumer: {e}")
        raise

def process_message(event, collection):
    try:
        logger.info(f"Processando evento: {event}")
        if 'service' in event and 'node' in event:
            last = collection.find_one(
                {"service": event["service"], "node": event["node"]},
                sort=[("timestamp", -1)]
            )
            if not last or last.get("status") != event.get("status"):
                collection.insert_one(event)
                logger.info(f"Evento de serviço salvo: {event['service']} - {event.get('status')}")
            else:
                logger.info("Status não mudou, evento ignorado")
        else:
            collection.insert_one(event)
            logger.info(f"Evento geral salvo no MongoDB: {event.get('event', 'N/A')}")
    except Exception as e:
        logger.error(f"Erro ao processar mensagem: {e} | Conteúdo: {json.dumps(event, ensure_ascii=False)}")

def main():
    logger.info("Iniciando consumer do Kafka...")
    wait_for_kafka()

    try:
        collection = get_mongo_collection()
    except Exception as e:
        logger.error(f"Falha ao conectar com MongoDB: {e}")
        return

    consumer = create_consumer()

    logger.info("Consumer iniciado. Aguardando mensagens...")

    mensagem_contador = 0

    try:
        logger.info("Entrando no loop de consumo...")
        for message in consumer:
            logger.info("Mensagem detectada no tópico")
            event = message.value
            logger.info(f"Mensagem recebida: {event}")
            process_message(event, collection)
            mensagem_contador += 1

        logger.info(f"Loop finalizado. Total de mensagens processadas: {mensagem_contador}")
    except KeyboardInterrupt:
        logger.info("Consumer interrompido pelo usuário")
    except Exception as e:
        logger.error(f"Erro no loop do consumer: {e}")
    finally:
        consumer.close()
        logger.info("Consumer finalizado")

if __name__ == "__main__":
    main()
