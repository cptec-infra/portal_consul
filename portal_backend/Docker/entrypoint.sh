#!/bin/sh
set -e

echo "📦 Aplicando migrações..."
python portal_backend/manage.py migrate --noinput

if [ "$CREATE_SUPERUSER" = "true" ]; then
    echo "👤 Verificando/Criação do superusuário..."
    python portal_backend/manage.py shell << END
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username=username).exists():
    print("✅ Superusuário não encontrado. Criando...")
    User.objects.create_superuser(username=username, email=email, password=password)
else:
    print("✅ Superusuário já existe.")
END
fi

echo "🚀 Iniciando o servidor Gunicorn..."

exec gunicorn --chdir portal_backend portal.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 120
