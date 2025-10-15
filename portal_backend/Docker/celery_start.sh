#!/bin/bash
set -e

echo "Aguardando Redis e Django estarem prontos..."

# Aguarda Redis
until nc -z portal_redis 6379; do
  echo "Aguardando Redis..."
  sleep 1
done

# Aguarda Django responder (porta 8000 interna ou 80 externa, depende da sua app)
until curl -s http://portal_django:8000 > /dev/null; do
  echo "Aguardando Django..."
  sleep 1
done

export PYTHONPATH=/app/portal_backend/portal

cd portal_backend

echo "Iniciando Celery Worker..."
celery -A portal worker --loglevel=info &

echo "Iniciando Celery Beat..."
celery -A portal beat --loglevel=info
