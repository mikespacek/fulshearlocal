#!/usr/bin/env node

// This script helps synchronize business data between environments
// It checks for valid businesses and ensures they all have proper category assignments
const { ConvexClient } = require("convex/browser");
const { api } = require("@/convex/_generated/api");

// Configure the environment URLs - change these as needed
const SOURCE_CONVEX_URL = process.env.SOURCE_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';
const TARGET_CONVEX_URL = process.env.TARGET_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';

// List of approved categories to enforce
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

async function main() {
  console.log("Business Synchronization Tool");
  console.log("=============================");
  console.log(`Source: ${SOURCE_CONVEX_URL}`);
  console.log(`Target: ${TARGET_CONVEX_URL}`);
  
  // Initialize Convex clients
  const sourceClient = new ConvexClient(SOURCE_CONVEX_URL);
  await sourceClient.initAuth();
  
  let targetClient;
  if (TARGET_CONVEX_URL !== SOURCE_CONVEX_URL) {
    targetClient = new ConvexClient(TARGET_CONVEX_URL);
    await targetClient.initAuth();
  } else {
    console.log("Source and target are the same - running in analysis mode only");
    targetClient = sourceClient;
  }
  
  // 1. Get all businesses from source
  const sourceBusinesses = await sourceClient.query(api.businesses.getAll);
  console.log(`Found ${sourceBusinesses.length} businesses in source`);
  
  // 2. Get all categories from source
  const sourceCategories = await sourceClient.query(api.categories.getAll);
  console.log(`Found ${sourceCategories.length} categories in source`);
  
  // Create a map of category IDs to category names
  const categoryMap = {};
  const categoryIdMap = {};
  
  for (const category of sourceCategories) {
    categoryMap[category._id] = category.name;
    categoryIdMap[category.name] = category._id;
  }
  
  // 3. Analyze businesses
  console.log("\nAnalyzing businesses...");
  
  const businessesByCategory = {};
  let businessesWithoutValidCategory = 0;
  
  for (const business of sourceBusinesses) {
    const categoryName = categoryMap[business.categoryId];
    
    // Track by category
    if (categoryName) {
      businessesByCategory[categoryName] = (businessesByCategory[categoryName] || 0) + 1;
      
      // Check if this is an approved category
      if (!APPROVED_CATEGORIES.includes(categoryName)) {
        businessesWithoutValidCategory++;
        console.log(`- Business "${business.name}" has non-approved category: ${categoryName}`);
      }
    } else {
      businessesWithoutValidCategory++;
      console.log(`- Business "${business.name}" has invalid category ID: ${business.categoryId}`);
    }
  }
  
  // 4. Report category stats
  console.log("\nBusinesses by Category:");
  for (const category of APPROVED_CATEGORIES) {
    const count = businessesByCategory[category] || 0;
    console.log(`- ${category}: ${count}`);
  }
  
  console.log(`\nBusinesses without valid category: ${businessesWithoutValidCategory}`);
  
  // 5. If source and target are different, check if we need to sync
  if (TARGET_CONVEX_URL !== SOURCE_CONVEX_URL) {
    const targetBusinesses = await targetClient.query(api.businesses.getAll);
    console.log(`\nFound ${targetBusinesses.length} businesses in target`);
    
    // Find businesses that exist in source but not in target
    const targetPlaceIds = new Set(targetBusinesses.map(b => b.placeId));
    const businessesToSync = sourceBusinesses.filter(b => !targetPlaceIds.has(b.placeId));
    
    console.log(`\n${businessesToSync.length} businesses need to be synced to target`);
    
    if (businessesToSync.length > 0) {
      // Ask for confirmation
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('\nDo you want to sync these businesses to the target? (yes/no): ', resolve);
      });
      
      if (answer.toLowerCase() === 'yes') {
        console.log('\nSyncing businesses...');
        
        let syncedCount = 0;
        for (const business of businessesToSync) {
          try {
            // Make sure this business has a valid category
            if (categoryMap[business.categoryId] && APPROVED_CATEGORIES.includes(categoryMap[business.categoryId])) {
              // Create the business in the target
              await targetClient.mutation(api.businesses.add, { business });
              syncedCount++;
              process.stdout.write('.');
            } else {
              // Try to assign a default category
              const updatedBusiness = {
                ...business,
                categoryId: categoryIdMap["Professional Services"] // Default category
              };
              
              await targetClient.mutation(api.businesses.add, { business: updatedBusiness });
              syncedCount++;
              process.stdout.write('c'); // 'c' for corrected
            }
          } catch (error) {
            console.error(`\nError syncing business ${business.name}: ${error.message}`);
          }
        }
        
        console.log(`\n\nSuccessfully synced ${syncedCount} businesses to target`);
      }
      
      readline.close();
    }
  }
  
  console.log("\nAnalysis complete!");
}

main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
}); 