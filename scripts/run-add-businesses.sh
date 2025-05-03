#!/bin/bash
# Script to run the addBusinessesToEmptyCategories mutation using Convex CLI

# Default admin key (can be overridden)
ADMIN_KEY="fulshear_admin_secret_key"

# Check if an admin key was provided as an argument
if [ "$1" != "" ]; then
  ADMIN_KEY="$1"
fi

echo "Running mutation to add businesses to empty categories..."
echo "Using admin key: $ADMIN_KEY"

# Run the mutation using Convex CLI
npx convex run addMissingBusinesses:addBusinessesToEmptyCategories '{"adminKey":"'$ADMIN_KEY'"}'

echo "Mutation completed!" 