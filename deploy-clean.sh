#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Performing Clean Deployment to Fix Cache Issues ===${NC}"

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install Vercel CLI. Please install manually with 'npm install -g vercel'.${NC}"
    exit 1
  fi
fi

# Check for environment file
if [ ! -f .env.local ]; then
  echo -e "${RED}Error: .env.local file not found!${NC}"
  echo "Please create a .env.local file with your environment variables."
  exit 1
fi

# Clear caches
echo -e "${BLUE}Cleaning up cache and build artifacts...${NC}"
rm -rf .next
rm -rf node_modules/.cache
# When deploying to Vercel, need to make sure the browser doesn't cache old files
echo "" > public/.vercel-cache-buster-$(date +%s)

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm ci
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}npm ci failed, trying npm install...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies!${NC}"
    exit 1
  fi
fi

# Deploy new Convex functions
echo -e "${BLUE}Deploying Convex functions to production...${NC}"
CONVEX_DEPLOYMENT=prod:rosy-cow-217 npx convex run fixCategoryDisplay
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to run category cleanup. Continuing anyway...${NC}"
fi

CONVEX_DEPLOYMENT=prod:rosy-cow-217 npx convex deploy
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to deploy Convex functions!${NC}"
  exit 1
fi

# Force rebuild
echo -e "${BLUE}Building application with cache busting...${NC}"
NEXT_PUBLIC_CACHE_BUSTER=$(date +%s) npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed! Please fix the issues before deploying.${NC}"
  exit 1
fi

# Deploy to Vercel
echo -e "${BLUE}=== Deploying to Vercel with --force flag ===${NC}"
echo "This will clear the deployment cache and force a fresh build."

# Check if user is logged in to Vercel
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}You're not logged in to Vercel. Logging in...${NC}"
  vercel login
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to log in to Vercel. Please try again later.${NC}"
    exit 1
  fi
fi

# Deploy with force flag
echo -e "${BLUE}Deploying to Vercel production environment...${NC}"
vercel --prod --force
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to deploy to Vercel.${NC}"
  exit 1
fi

echo -e "${GREEN}=== Clean deployment completed! ===${NC}"
echo "The site should now show the correct categories without duplicates."
echo "If you still see duplicates, try clearing your browser cache or viewing in incognito mode." 