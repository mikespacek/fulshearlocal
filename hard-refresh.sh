#!/bin/bash

# Stop any running Next.js server
echo "Stopping any running Next.js servers..."
pkill -f "next dev" || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Clear node_modules
echo "Clearing node_modules (this might take a while)..."
rm -rf node_modules

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Start the development server
echo "Starting the development server..."
npm run dev 