 # Variáveis
COMPOSE_TIMEOUT = 240

# Comando base (o arquivo muda conforme o alvo chamado)
define compose
	COMPOSE_HTTP_TIMEOUT=$(COMPOSE_TIMEOUT) docker compose -f $(1)
endef

# Ambiente de desenvolvimento
start-dev:
	$(call compose,docker-compose_dev.yml) up

# Ambiente de produção
start-prod:
	$(call compose,docker-compose.yml) up -d

# Parar containers (dev)
stop-dev:
	$(call compose,docker-compose_dev.yml) down 

# Parar containers (prod)
stop-prod:
	$(call compose,docker-compose.yml) down
