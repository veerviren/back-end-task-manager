#!/bin/sh

echo "Starting database reset and migration process..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
# Use a more reliable check with pg_isready
max_attempts=30
attempt_num=1
while [ $attempt_num -le $max_attempts ]
do
  # Try using pg_isready to check if PostgreSQL is up
  if pg_isready -h postgres -p 5432 -U postgres > /dev/null 2>&1; then
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

# Reset the database (drops all tables and recreates them)
echo "Resetting database..."
# Using --force to skip confirmation prompts and --skip-seed if you don't want to run seed scripts every time
npx prisma migrate reset --force --skip-generate

# Apply migrations
echo "Applying migrations..."
npx prisma migrate deploy

# Generate Prisma client if needed
echo "Generating Prisma client..."
npx prisma generate

echo "Database setup completed successfully!"

# Start the application
echo "Starting the application..."
exec npm run start
