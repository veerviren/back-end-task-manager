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

## Deployment to Google Cloud Run

This application is configured for deployment to Google Cloud Run, a fully managed serverless platform for containerized applications.

### Prerequisites for Cloud Run Deployment

- Google Cloud Platform account
- Google Cloud CLI (`gcloud`) installed and configured
- Cloud SQL PostgreSQL instance

### Deployment Steps

1. **Build and Deploy to Cloud Run**

   ```bash
   gcloud run deploy campus-exchange \
     --source . \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **Alternative Manual Deployment**

   ```bash
   # Build and push the container
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/campus-exchange

   # Deploy to Cloud Run
   gcloud run deploy campus-exchange \
     --image gcr.io/YOUR_PROJECT_ID/campus-exchange \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Setting Environment Variables**

   ```bash
   gcloud run services update campus-exchange \
     --set-env-vars="DATABASE_URL=your-postgres-url,JWT_SECRET=xyz,EMAIL_USER=abc,EMAIL_PASS=123" \
     --region us-central1
   ```

4. **Connect to Cloud SQL**

   To use with Cloud SQL, create an instance and connect with the following URL format:

   ```
   postgresql://user:password@/dbname?host=/cloudsql/PROJECT_ID:REGION:INSTANCE
   ```

   Add the Cloud SQL instance to your Cloud Run service:

   ```bash
   gcloud run services update campus-exchange \
     --add-cloudsql-instances=PROJECT_ID:REGION:INSTANCE \
     --region us-central1
   ```

### CI/CD Setup

This repository includes GitHub Actions workflow configuration for continuous deployment to Cloud Run. To use it:

1. Set up GitHub repository secrets:
   - `GCP_PROJECT_ID`: Your Google Cloud Project ID
   - `GCP_SA_KEY`: Your service account key (JSON)
   - `CLOUD_SQL_CONNECTION_NAME`: Your Cloud SQL instance connection name
   - `DATABASE_URL`: PostgreSQL connection string
   - Other environment variables (JWT_SECRET, EMAIL_* variables, etc.)

2. Push changes to the main branch to trigger automatic deployment.

### Important Production Considerations

- Database migrations are handled automatically but don't use `migrate reset` in production
- Secure sensitive environment variables using Secret Manager
- Consider implementing authentication for your API endpoints
- Set up monitoring and alerting through Cloud Monitoring
