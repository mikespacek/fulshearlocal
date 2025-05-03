#!/bin/bash

# Script to run the business import

echo "Starting import of businesses into Convex database..."

# Make sure we have all dependencies
npm install convex dotenv

# Make the import script executable
chmod +x scripts/import-businesses.js

# Run the import
node scripts/import-businesses.js

echo "Import process complete!" 