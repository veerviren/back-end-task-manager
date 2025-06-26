#!/bin/bash
# Script to deploy to Cloud Run with simplified deployment

echo "Building and deploying Campus Exchange to Cloud Run..."

# First rename our Cloud Dockerfile to be the primary Dockerfile temporarily
if [ -f "Dockerfile" ]; then
  mv Dockerfile Dockerfile.original
fi
mv Dockerfile.cloud Dockerfile

# 1. Build and deploy with the simplified Dockerfile
gcloud run deploy campus-exchange \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --source=. \
  --set-env-vars="NODE_ENV=production"

# 2. Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful! Getting URL..."
  URL=$(gcloud run services describe campus-exchange --format="value(status.url)")
  
  echo "Your application is deployed at: $URL"
  echo "Swagger API documentation is available at: $URL/api-docs"
else
  echo "Deployment failed. Check the logs for errors."
fi

# Restore original Dockerfile
if [ -f "Dockerfile.original" ]; then
  mv Dockerfile.original Dockerfile
else
  # If deployment failed before renaming the original, we need to restore from the cloud version
  mv Dockerfile Dockerfile.cloud
  if [ -f "Dockerfile.original" ]; then
    mv Dockerfile.original Dockerfile
  fi
fi

echo "Dockerfile restored to original state."
