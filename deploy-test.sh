#!/bin/bash

echo "Building and deploying a minimal test server to Cloud Run..."

# Using buildpacks directly with Cloud Run to skip local Docker build
# This avoids permission issues with the Docker daemon
echo "Deploying directly to Cloud Run using buildpacks..."

# Deploy to Cloud Run using source-based deployment
# This approach skips the need for local Docker and pushes directly to Cloud Run
echo "Deploying to Cloud Run using source-based deployment..."
gcloud run deploy test-server \
  --source . \
  --dockerfile Dockerfile.test \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production"

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful! Getting URL..."
  URL=$(gcloud run services describe test-server --format="value(status.url)")
  
  echo "Your test application is deployed at: $URL"
  echo "Try accessing $URL/env to see environment information"
else
  echo "Deployment failed. Check the logs for errors."
fi
