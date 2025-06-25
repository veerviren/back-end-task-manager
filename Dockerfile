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

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
