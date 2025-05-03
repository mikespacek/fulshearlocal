#!/bin/bash
# Script to update photos for businesses in the database

# Check if the Google Maps API key was provided
if [ -z "$1" ]; then
  echo "Error: Google Maps API key is required"
  echo "Usage: $0 <GOOGLE_MAPS_API_KEY> [BUSINESS_ID]"
  exit 1
fi

GOOGLE_API_KEY="$1"
BUSINESS_ID="$2"  # Optional specific business ID

echo "Updating business photos from Google Places API..."
echo "Using Google Maps API Key: ${GOOGLE_API_KEY:0:5}...${GOOGLE_API_KEY: -5}"

# If a specific business ID was provided
if [ -n "$BUSINESS_ID" ]; then
  echo "Updating photos for business ID: $BUSINESS_ID"
  
  # Call the updateBusinessPhotos action for a specific business
  npx convex run -f updateBusinessPhotos:updateBusinessPhotos '{"googleApiKey":"'$GOOGLE_API_KEY'", "businessIds": ["'$BUSINESS_ID'"]}'
else
  echo "Updating photos for all businesses without photos"
  
  # Call the updateBusinessPhotos action to update all businesses without photos
  npx convex run -f updateBusinessPhotos:updateBusinessPhotos '{"googleApiKey":"'$GOOGLE_API_KEY'"}'
fi

echo "Photo update process completed!"
echo "Check the Convex logs for details on updated businesses."
echo "You can view the dashboard with: npx convex dashboard" 