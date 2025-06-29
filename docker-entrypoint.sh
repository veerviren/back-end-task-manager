#!/bin/sh

echo "Starting database connection and migration process..."

echo "Running in local/development mode..."
# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
max_attempts=30
attempt_num=1
while [ $attempt_num -le $max_attempts ]
do
  if pg_isready -h ${POSTGRES_HOST:-postgres} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
    echo "PostgreSQL is up and ready!"
    break
  fi
  if npx prisma migrate status > /dev/null 2>&1; then
    echo "Prisma can connect to PostgreSQL!"
    break
  fi
  echo "PostgreSQL is unavailable - sleeping (Attempt: $attempt_num/$max_attempts)"
  sleep 2
  attempt_num=$(( attempt_num + 1 ))
done

if [ $attempt_num -gt $max_attempts ]; then
  echo "Failed to connect to PostgreSQL after $max_attempts attempts. Exiting..."
  exit 1
fi

# Reset the database only in development environment
if [ "$NODE_ENV" = "development" ]; then
  echo "PostgreSQL is up - starting fresh database setup"
  echo "Resetting database..."
  npx prisma migrate reset --force --skip-generate
  echo "Development migrations completed."
else
  echo "Production mode: Applying migrations without resetting database..."
  npx prisma migrate deploy
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Database setup completed successfully!"

echo "Starting the application..."
exec npm run start
