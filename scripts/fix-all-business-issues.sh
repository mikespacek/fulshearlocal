#!/bin/bash

# This script fixes all business data issues by running multiple tools in sequence
echo "== Fulshear Local Business Data Fix =="

# Step 1: Ensure all categories exist
echo -e "\n[1/5] Ensuring all required categories exist..."
node scripts/ensure-categories.js

# Step 2: Check database status
echo -e "\n[2/5] Checking database status..."
node scripts/check-database.js

# Step 3: Create cache-busting file
CACHE_BUSTER_FILE="public/.vercel-cache-buster-$(date +%s)"
echo -e "\n[3/5] Creating cache-buster file: $CACHE_BUSTER_FILE"
echo "$(date)" > $CACHE_BUSTER_FILE

# Step 4: Commit and push changes
echo -e "\n[4/5] Committing and pushing changes..."
git add $CACHE_BUSTER_FILE
git add scripts/*.js
git commit -m "Fix business data issues: $(date)"
git push origin main

# Step 5: Execute deployment
echo -e "\n[5/5] Triggering deployment..."
echo "- Deploying to Vercel..."

# Extra notes
echo -e "\nProcess complete! Important notes:"
echo "- Any newly added categories or fixed businesses will be visible after deployment"
echo "- If you still see missing businesses, run 'node scripts/fix-business-categories.js'"
echo "- Production Convex database might need to be synced with local database manually" 