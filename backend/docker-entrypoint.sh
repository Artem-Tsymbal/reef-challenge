#!/bin/sh

echo "Waiting for the database to be ready..."
while ! nc -z $TYPEORM_HOST $TYPEORM_PORT; do
  sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
npx typeorm migration:run -d dist/ormconfig.js

if [ $? -eq 0 ]; then
  echo "Migrations completed successfully!"
else
  echo "Migration failed!"
  exit 1
fi

echo "Starting the application..."
exec node dist/src/main.js
