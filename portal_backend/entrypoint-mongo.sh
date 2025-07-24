#!/bin/bash
set -eu

echo ">> Variáveis recebidas:"
echo "MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE:-<não definida>}"
echo "MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-<não definida>}"
echo "MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-<não definida>}"

# Gera o arquivo init-mongo.js substituindo as variáveis do ambiente
cat <<EOF > /docker-entrypoint-initdb.d/init-mongo.js
db = db.getSiblingDB('${MONGO_INITDB_DATABASE}');

db.createUser({
  user: '${MONGO_INITDB_ROOT_USERNAME}',
  pwd: '${MONGO_INITDB_ROOT_PASSWORD}',
  roles: [
    {
      role: 'readWrite',
      db: '${MONGO_INITDB_DATABASE}'
    }
  ]
});
EOF

# Executa o entrypoint oficial do mongo com os argumentos
exec docker-entrypoint.sh mongod