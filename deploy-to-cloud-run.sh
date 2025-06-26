#!/bin/bash
# Script to deploy to Cloud Run with simplified deployment

echo "Building and deploying Campus Exchange to Cloud Run..."

# 1. Build and deploy with the simplified Dockerfile
gcloud run deploy campus-exchange \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --source=. \
  --dockerfile=Dockerfile.cloud \
  --set-env-vars="NODE_ENV=production,PORT=8080"

# 2. Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful! Getting URL..."
  URL=$(gcloud run services describe campus-exchange --format="value(status.url)")
  
  echo "Your application is deployed at: $URL"
  echo "Swagger API documentation is available at: $URL/api-docs"
else
  echo "Deployment failed. Check the logs for errors."
fi
