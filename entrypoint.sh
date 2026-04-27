#!/bin/sh
set -e

# test env manages its own DB state — never auto-migrate here
if [ "$NODE_ENV" = "test" ]; then
  exec "$@"
fi

echo "Running database migrations..."
npx sequelize-cli db:migrate

# seeds are dev convenience only — never in production or test
if [ "$NODE_ENV" = "development" ]; then
  echo "Running seeders..."
  npx sequelize-cli db:seed:all
fi

exec "$@"
