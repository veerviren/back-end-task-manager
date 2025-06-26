#!/bin/bash

echo "Building and deploying a minimal test server to Cloud Run..."

# Build the container locally
echo "Building container locally..."
docker build -t test-server:latest -f Dockerfile.test .

# Tag it for Google Container Registry
echo "Tagging for Google Container Registry..."
docker tag test-server:latest gcr.io/campus-exchange-project/test-server:latest

# Configure Docker to use gcloud credentials
echo "Configuring Docker auth for GCR..."
gcloud auth configure-docker

# Push to Google Container Registry
echo "Pushing to Google Container Registry..."
docker push gcr.io/campus-exchange-project/test-server:latest

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy test-server \
  --image gcr.io/campus-exchange-project/test-server:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo "Deployment successful! Getting URL..."
  URL=$(gcloud run services describe test-server --format="value(status.url)")
  
  echo "Your test application is deployed at: $URL"
  echo "Try accessing $URL/env to see environment information"
else
  echo "Deployment failed. Check the logs for errors."
fi
