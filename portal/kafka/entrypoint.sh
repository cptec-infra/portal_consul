#!/bin/bash
set -e

DATA_DIR="/var/lib/kafka/data"

# Formata o diretório se não estiver formatado
if [ -z "$(ls -A $DATA_DIR/meta.properties 2>/dev/null)" ]; then
  echo "Formatação inicial do cluster Kafka com UUID: $KAFKA_CLUSTER_ID"
  kafka-storage format --cluster-id "$KAFKA_CLUSTER_ID" --config /etc/kafka/kafka.properties
else
  echo "Cluster já formatado. Iniciando Kafka normalmente."
fi

# Executa o Kafka
exec kafka-server-start /etc/kafka/kafka.properties
