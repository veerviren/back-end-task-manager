FROM node:18-alpine

# Install PostgreSQL client for pg_isready command
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make entrypoint script executable
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Use ARG for build-time variable with Cloud Run standard port
ARG PORT=8080
ENV PORT=${PORT}

# Expose the port from environment variable (Cloud Run uses 8080 by default)
EXPOSE ${PORT}

# Use entrypoint script for database setup (if needed)
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Command to run the application if entrypoint fails
CMD ["npm", "run", "start"]