#!/usr/bin/env node

// This script fixes businesses with invalid or non-approved categories
const { ConvexClient } = require("convex/browser");
const { api } = require("@/convex/_generated/api");

// Configure the Convex URL - change as needed
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';

// List of approved categories
const APPROVED_CATEGORIES = [
  "Restaurants",
  "Shopping",
  "Medical & Dental",
  "Beauty & Wellness",
  "Financial Services",
  "Real Estate",
  "Automotive",
  "Professional Services",
  "Childcare & Education",
  "Religious Organizations",
  "Sports & Fitness",
  "Recreation & Entertainment",
  "Home Services"
];

// Fallback category in case a business has an invalid category
const DEFAULT_CATEGORY = "Professional Services";

async function main() {
  console.log("Business Category Fix Tool");
  console.log("==========================");
  console.log(`Convex URL: ${CONVEX_URL}`);
  
  // Initialize Convex client
  const client = new ConvexClient(CONVEX_URL);
  await client.initAuth();
  
  // 1. Get all businesses
  const businesses = await client.query(api.businesses.getAll);
  console.log(`Found ${businesses.length} businesses`);
  
  // 2. Get all categories
  const categories = await client.query(api.categories.getAll);
  console.log(`Found ${categories.length} categories`);
  
  // Create maps for easy lookup
  const categoryMap = {};
  const categoryIdMap = {};
  const approvedCategoryIds = new Set();
  
  for (const category of categories) {
    categoryMap[category._id] = category.name;
    categoryIdMap[category.name] = category._id;
    
    if (APPROVED_CATEGORIES.includes(category.name)) {
      approvedCategoryIds.add(category._id);
    }
  }
  
  // Check if we have all the required categories
  for (const categoryName of APPROVED_CATEGORIES) {
    if (!categoryIdMap[categoryName]) {
      console.log(`WARNING: Approved category "${categoryName}" does not exist in the database!`);
      console.log("You should create this category before continuing.");
      return;
    }
  }
  
  // 3. Identify businesses with category issues
  const businessesToFix = [];
  
  for (const business of businesses) {
    const categoryName = categoryMap[business.categoryId];
    
    // Check if the business has a valid category
    if (!categoryName) {
      businessesToFix.push({
        business,
        issue: "invalid_id",
        newCategoryId: categoryIdMap[DEFAULT_CATEGORY]
      });
    }
    // Check if the category is approved
    else if (!APPROVED_CATEGORIES.includes(categoryName)) {
      businessesToFix.push({
        business,
        issue: "not_approved",
        currentCategory: categoryName,
        newCategoryId: categoryIdMap[DEFAULT_CATEGORY]
      });
    }
  }
  
  // 4. Report on issues
  console.log(`\nFound ${businessesToFix.length} businesses with category issues:`);
  
  const invalidIdCount = businessesToFix.filter(b => b.issue === "invalid_id").length;
  const notApprovedCount = businessesToFix.filter(b => b.issue === "not_approved").length;
  
  console.log(`- ${invalidIdCount} businesses with invalid category IDs`);
  console.log(`- ${notApprovedCount} businesses with non-approved categories`);
  
  // 5. Exit if no issues to fix
  if (businessesToFix.length === 0) {
    console.log("\nNo issues to fix. All businesses have valid, approved categories.");
    return;
  }
  
  // 6. Ask for confirmation before fixing
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    readline.question('\nDo you want to fix these category issues? (yes/no): ', resolve);
  });
  
  if (answer.toLowerCase() !== 'yes') {
    console.log("Operation cancelled by user");
    readline.close();
    return;
  }
  
  // 7. Fix the issues
  console.log("\nFixing category issues...");
  
  let fixedCount = 0;
  for (const { business, newCategoryId } of businessesToFix) {
    try {
      // Update the business with the new category ID
      await client.mutation(api.businesses.update, {
        id: business._id,
        updates: {
          categoryId: newCategoryId,
          lastUpdated: Date.now()
        }
      });
      
      fixedCount++;
      process.stdout.write('.');
    } catch (error) {
      console.error(`\nError fixing business ${business.name}: ${error.message}`);
    }
  }
  
  console.log(`\n\nSuccessfully fixed ${fixedCount} out of ${businessesToFix.length} businesses`);
  readline.close();
}

main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
}); 