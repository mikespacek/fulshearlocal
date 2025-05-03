#!/bin/bash

# Create .env.local file
cat > .env.local << EOL
# Convex deployment URL
NEXT_PUBLIC_CONVEX_URL=https://rosy-cow-217.convex.cloud

# Google Maps API key - Replace with your actual API key if needed
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyABzht1PL3Ze8HIYQLmualN-fM800vw_HI

# Admin key for refreshing data
ADMIN_KEY=admin_secret_key
EOL

echo ".env.local file created successfully" 