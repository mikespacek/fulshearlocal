#!/bin/bash

# This script deploys the application with a data refresh to ensure all businesses appear correctly
echo "== Fulshear Local Deployment with Data Refresh =="

# Create a cache-busting file
CACHE_BUSTER_FILE="public/.vercel-cache-buster-$(date +%s)"
echo "Creating cache-buster file: $CACHE_BUSTER_FILE"
echo "$(date)" > $CACHE_BUSTER_FILE

# Add the cache-buster file to git
echo "Adding cache-buster to git..."
git add $CACHE_BUSTER_FILE

# Commit the cache-buster
echo "Committing cache-buster..."
git commit -m "Deploy with data refresh: $(date)"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

# Now run the business category fix script if Node.js is installed
if command -v node &>/dev/null; then
    echo "Running business category fix script..."
    node scripts/fix-business-categories.js
else
    echo "Node.js not found. Skipping business category fix script."
    echo "You should run 'node scripts/fix-business-categories.js' manually to fix any category issues."
fi

echo "Deployment initiated. Vercel should automatically deploy the updated application."
echo "Remember to run the business category fix script on the production database if needed." 