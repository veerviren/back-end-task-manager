# Campus Exchange

A modern Node.js backend application for managing products and users built with Express, TypeScript, Prisma ORM, and PostgreSQL.

## Features

- RESTful API for products and users
- PostgreSQL database with Prisma ORM
- JWT authentication middleware
- Email service for verification
- API documentation with Swagger
- Docker containerization for easy deployment
- Fresh database setup on each run

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Documentation**: Swagger
- **Containerization**: Docker, Docker Compose
- **Email Service**: Nodemailer

## Project Structure

```
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migrations
├── src/
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middleware
│   ├── repositories/         # Database operations
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── server.ts             # Server entry point
│   └── swagger.ts            # API documentation
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image definition
├── docker-entrypoint.sh      # Container startup script
└── tsconfig.json             # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js v18 or later
- Docker and Docker Compose

### Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` (see `.env.example`)
4. Start the development server:
   ```bash
   npm run dev
   ```

### Running with Docker

The application is containerized and set up to provide a fresh database on each run.

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. To stop the containers:
   ```bash
   docker-compose down
   ```

3. To start again with a fresh database:
   ```bash
   docker-compose up
   ```

The application will be available at http://localhost:3000

API documentation is available at http://localhost:3000/api-docs

## Database

The database schema includes:

- **User**: Authentication and profile data
- **Product**: Product details including relationships to sellers and buyers

On each Docker container startup, the database is automatically reset and migrations are applied, ensuring a fresh state for development or testing.

## API Endpoints

- `/api/users` - User management
- `/api/products` - Product management

For detailed API documentation, visit the Swagger UI at `/api-docs` when the server is running.
