FROM python:3.11-slim

WORKDIR /app/portal_backend

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY .env .env

COPY portal_backend/Docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]