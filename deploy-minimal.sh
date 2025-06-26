#!/bin/bash
# Script to deploy to Cloud Run with minimal deployment for testing

echo "Building and deploying Campus Exchange (minimal version) to Cloud Run..."

# First rename our minimal Dockerfile to be the primary Dockerfile temporarily
if [ -f "Dockerfile" ]; then
  mv Dockerfile Dockerfile.original
fi
mv Dockerfile.minimal Dockerfile

# Deploy with the minimal Dockerfile
gcloud run deploy campus-exchange-test \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --source=. \
  --set-env-vars="NODE_ENV=production" \
  --timeout=5m \
  --cpu=1 \
  --memory=512Mi

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful! Getting URL..."
  URL=$(gcloud run services describe campus-exchange-test --format="value(status.url)")
  
  echo "Your application is deployed at: $URL"
else
  echo "Deployment failed. Check the logs for errors."
fi

# Restore original Dockerfile
if [ -f "Dockerfile.original" ]; then
  mv Dockerfile.original Dockerfile
else
  # If deployment failed before renaming the original, we need to restore from the minimal version
  mv Dockerfile Dockerfile.minimal
  if [ -f "Dockerfile.original" ]; then
    mv Dockerfile.original Dockerfile
  fi
fi

echo "Dockerfile restored to original state."
