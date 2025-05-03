#!/bin/bash

# Script to run the education category deletion

echo "Starting Education category deletion..."

# Make sure we have all dependencies
npm install convex dotenv

# Make the script executable
chmod +x scripts/delete-education-category.js

# Run the deletion
node scripts/delete-education-category.js

echo "Category deletion process complete!" 