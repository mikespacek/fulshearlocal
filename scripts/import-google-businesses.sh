#!/bin/bash
# Script to import businesses from Google Maps using the Google Places API

# Check if the Google Maps API key was provided
if [ -z "$1" ]; then
  echo "Error: Google Maps API key is required"
  echo "Usage: $0 <GOOGLE_MAPS_API_KEY> [ADMIN_KEY]"
  exit 1
fi

GOOGLE_API_KEY="$1"
ADMIN_KEY="${2:-fulshear_admin_secret_key}"

echo "Importing businesses from Google Maps..."
echo "Using Google Maps API Key: ${GOOGLE_API_KEY:0:5}...${GOOGLE_API_KEY: -5}"
echo "Using Admin Key: ${ADMIN_KEY:0:3}...${ADMIN_KEY: -3}"

# Call the importFulshearBusinesses action with the provided API key
# This will fetch places from Google and add them to the database
echo "Starting business import..."
npx convex run -f importGooglePlaces:importFulshearBusinesses '{"googleApiKey":"'$GOOGLE_API_KEY'", "deleteExisting": false, "daysToLookBack": 365}'

echo "Business import completed!"
echo "Check the Convex dashboard for details on imported businesses."
echo "You can view the dashboard with: npx convex dashboard" 