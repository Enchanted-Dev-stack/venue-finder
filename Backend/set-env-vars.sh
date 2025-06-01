#!/bin/bash
# Run this script after creating your App Engine service
# Replace YOUR-PROJECT-ID with your actual GCP project ID
# Add all your environment variables from .env here

gcloud app deploy app.yaml --project=YOUR-PROJECT-ID

# Set environment variables (run these commands after deployment)
gcloud app update --project=YOUR-PROJECT-ID \
  --update-env-vars MONGO_URI="your_mongo_connection_string" \
  --update-env-vars JWT_SECRET="your_jwt_secret" \
  --update-env-vars CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name" \
  --update-env-vars CLOUDINARY_API_KEY="your_cloudinary_api_key" \
  --update-env-vars CLOUDINARY_API_SECRET="your_cloudinary_api_secret" \
  --update-env-vars FRONTEND_URL="https://your-frontend-url.com"
