#!/bin/bash

# Script to run the education category consolidation

echo "Starting consolidation of education categories..."

# Make sure we have all dependencies
npm install convex dotenv

# Make the script executable
chmod +x scripts/consolidate-education-categories.js

# Run the consolidation
node scripts/consolidate-education-categories.js

echo "Consolidation process complete!" 