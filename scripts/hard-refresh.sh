#!/bin/bash

echo "===== Performing Hard Refresh of Next.js Application ====="

# Kill any running Next.js development servers
echo "Stopping any running Next.js servers..."
pkill -f "next dev" || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next/
rm -rf node_modules/.cache/

# Create a cache buster file
CACHE_BUSTER_VALUE=$(date +%s)
echo "Creating cache buster file with timestamp $CACHE_BUSTER_VALUE..."
mkdir -p public
echo "$CACHE_BUSTER_VALUE" > public/.vercel-cache-buster-$CACHE_BUSTER_VALUE

# Reinstall dependencies (optional but sometimes helps)
# echo "Reinstalling node modules..."
# rm -rf node_modules
# npm install

# Rebuild the app
echo "Rebuilding the application..."
npm run build

echo "===== Hard refresh completed! ====="
echo "You can now restart your development server with: npm run dev" 