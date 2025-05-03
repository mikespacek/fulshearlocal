#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display usage
show_usage() {
  echo "Usage: ./deploy.sh [options]"
  echo "Options:"
  echo "  --vercel-cli      Deploy using Vercel CLI after preparation"
  echo "  --help            Show this help message"
}

# Parse command line arguments
USE_VERCEL_CLI=false

for arg in "$@"; do
  case $arg in
    --vercel-cli)
      USE_VERCEL_CLI=true
      shift
      ;;
    --help)
      show_usage
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $arg${NC}"
      show_usage
      exit 1
      ;;
  esac
done

echo -e "${BLUE}=== Fulshear Local Deployment Preparation ===${NC}"

# Check for Vercel CLI if requested
if [ "$USE_VERCEL_CLI" = true ] && ! command -v vercel &> /dev/null; then
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
  echo "Please create a .env.local file with your environment variables:"
  echo "NEXT_PUBLIC_CONVEX_URL=your_convex_url"
  echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key"
  echo "ADMIN_KEY=your_admin_key"
  exit 1
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to install dependencies!${NC}"
  exit 1
fi

# Run linting
echo -e "${BLUE}Running linter...${NC}"
npm run lint
if [ $? -ne 0 ]; then
  echo -e "${RED}Linting issues found! Fix them or re-run with --ignore-lint to continue anyway.${NC}"
  exit 1
fi

# Build the application
echo -e "${BLUE}Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed! Please fix the issues before deploying.${NC}"
  exit 1
fi

# Deploy Convex functions
echo -e "${BLUE}Deploying Convex functions...${NC}"
npx convex deploy
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to deploy Convex functions!${NC}"
  exit 1
fi

echo -e "${GREEN}=== Deployment preparation completed successfully! ===${NC}"

# Deploy to Vercel if requested
if [ "$USE_VERCEL_CLI" = true ]; then
  echo -e "${BLUE}=== Deploying to Vercel ===${NC}"
  echo "You'll be prompted to enter your environment variables during deployment."
  
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
  
  # Deploy to Vercel
  echo -e "${BLUE}Deploying to Vercel preview environment...${NC}"
  vercel
  
  # Ask if user wants to deploy to production
  echo -e "${YELLOW}Do you want to deploy to production? (y/n)${NC}"
  read -r deploy_prod
  if [[ $deploy_prod =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Deploying to Vercel production environment...${NC}"
    vercel --prod
  else
    echo -e "${BLUE}Skipping production deployment. You can deploy to production later with 'vercel --prod'.${NC}"
  fi
  
  echo -e "${GREEN}=== Deployment completed! ===${NC}"
else
  echo -e "${BLUE}Next steps:${NC}"
  echo "1. Push your code to a Git repository"
  echo "2. Set up a new project on Vercel"
  echo "3. Connect your Git repository to Vercel"
  echo "4. Configure environment variables on Vercel"
  echo "5. Deploy your application"
  echo ""
  echo -e "${YELLOW}Or run this script with --vercel-cli to deploy using the Vercel CLI${NC}"
  echo -e "${GREEN}See VERCEL_DEPLOYMENT.md for detailed instructions.${NC}"
fi 