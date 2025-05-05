#!/bin/bash

echo "Clearing Next.js cache..."

# Stop any running Next.js process
# pkill -f "next dev" || true

# Remove the Next.js cache directories
rm -rf .next/
rm -rf node_modules/.cache

echo "Cache cleared successfully!"
echo "You can now restart your development server with: npm run dev" 