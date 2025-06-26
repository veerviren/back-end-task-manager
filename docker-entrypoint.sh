#!/bin/sh

echo "Starting database connection and migration process..."

# Check if we're running in Cloud Run (production) or locally
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode (Cloud Run)..."
  # Cloud Run with Cloud SQL should already be connected via the socket
  # No need to wait for PostgreSQL to start, just proceed with migrations
  echo "Using Cloud SQL connection..."
else
  echo "Running in development mode..."
  # Wait for PostgreSQL to be ready
  echo "Waiting for PostgreSQL to start..."
  # Use a more reliable check with pg_isready
  max_attempts=30
  attempt_num=1
  while [ $attempt_num -le $max_attempts ]
  do
    # Try using pg_isready to check if PostgreSQL is up
    if pg_isready -h ${POSTGRES_HOST:-postgres} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
      echo "PostgreSQL is up and ready!"
      break
    fi
  
  # If Prisma can connect, that's also a good indicator
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

  echo "PostgreSQL is up - starting fresh database setup"

  # Reset the database (drops all tables and recreates them) - only in development
  echo "Resetting database..."
  # Using --force to skip confirmation prompts and --skip-seed if you don't want to run seed scripts every time
  npx prisma migrate reset --force --skip-generate
fi

# For production (Cloud Run), just deploy migrations without resetting
if [ "$NODE_ENV" = "production" ]; then
  echo "Applying migrations for production..."
  npx prisma migrate deploy
else
  # In development, migrations should already be done by the reset above
  echo "Development migrations completed in earlier step"
fi

# Generate Prisma client if needed
echo "Generating Prisma client..."
npx prisma generate

echo "Database setup completed successfully!"

# Start the application
echo "Starting the application..."
exec npm run start
