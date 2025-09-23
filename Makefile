COMPOSE_TIMEOUT = 240

define compose
	COMPOSE_HTTP_TIMEOUT=$(COMPOSE_TIMEOUT) docker compose -f $(1)
endef

start-dev:
	$(call compose,docker-compose_dev.yml) up

start-prod:
	$(call compose,docker-compose.yml) up

start-prod-build:
	$(call compose,docker-compose.yml) up --build

stop-dev:
	$(call compose,docker-compose_dev.yml) down 

stop-prod:
	$(call compose,docker-compose.yml) down