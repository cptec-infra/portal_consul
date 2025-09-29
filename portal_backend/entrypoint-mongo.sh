#!/bin/bash

set -eu

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

exec docker-entrypoint.sh mongod