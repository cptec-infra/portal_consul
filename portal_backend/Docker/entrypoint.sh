#!/bin/bash

echo "📦 Aplicando migrações..."
python manage.py migrate

echo "👤 Verificando/Criação do superusuário..."
python manage.py shell << END
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

echo "🚀 Iniciando o servidor..."
exec python manage.py runserver 0.0.0.0:8000
