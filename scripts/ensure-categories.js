#!/usr/bin/env node

// This script ensures all required categories exist in the database
// It will create any missing categories and is safe to run multiple times
const https = require('https');

// Configure the Convex URL - change as needed
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';

// List of required categories that must exist
const REQUIRED_CATEGORIES = [
  {
    name: "Restaurants",
    description: "Local dining, cafes, and restaurants in Fulshear, TX"
  },
  {
    name: "Shopping",
    description: "Retail stores and shopping centers in Fulshear, TX"
  },
  {
    name: "Medical & Dental",
    description: "Healthcare providers, clinics, and doctors in Fulshear, TX"
  },
  {
    name: "Beauty & Wellness",
    description: "Salons, spas, and wellness centers in Fulshear, TX"
  },
  {
    name: "Financial Services",
    description: "Banks, financial advisors, and insurance in Fulshear, TX"
  },
  {
    name: "Real Estate",
    description: "Property management and real estate services in Fulshear, TX"
  },
  {
    name: "Automotive",
    description: "Car repairs, dealerships, and auto services in Fulshear, TX"
  },
  {
    name: "Professional Services",
    description: "Business and professional services in Fulshear, TX"
  },
  {
    name: "Childcare & Education",
    description: "Schools, daycares, and educational services in Fulshear, TX"
  },
  {
    name: "Religious Organizations",
    description: "Churches, temples, and places of worship in Fulshear, TX"
  },
  {
    name: "Sports & Fitness",
    description: "Gyms, fitness centers, and sports facilities in Fulshear, TX"
  },
  {
    name: "Recreation & Entertainment",
    description: "Fun activities and entertainment in Fulshear, TX"
  },
  {
    name: "Home Services",
    description: "Home repair, maintenance, and services in Fulshear, TX"
  }
];

// Simple function to make a POST request to Convex
function convexRequest(url, endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(`${url}/${endpoint}`, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

// Convex query helper
function convexQuery(url, query, args = {}) {
  return convexRequest(url, 'api/query', {
    reflectionQuery: query,
    args
  });
}

// Convex mutation helper
function convexMutation(url, mutation, args = {}) {
  return convexRequest(url, 'api/mutation', {
    reflectionMutation: mutation,
    args
  });
}

async function main() {
  console.log("Category Validation Tool");
  console.log("=======================");
  console.log(`Convex URL: ${CONVEX_URL}`);
  
  try {
    // 1. Get all existing categories
    console.log("\nFetching existing categories...");
    const categories = await convexQuery(CONVEX_URL, "categories:getAll");
    console.log(`Found ${categories.length} categories`);
    
    // Create a map of category names to IDs
    const existingCategories = new Map();
    for (const category of categories) {
      existingCategories.set(category.name, category._id);
    }
    
    // 2. Check for missing categories
    const missingCategories = [];
    for (const requiredCategory of REQUIRED_CATEGORIES) {
      if (!existingCategories.has(requiredCategory.name)) {
        missingCategories.push(requiredCategory);
      }
    }
    
    // 3. Report on missing categories
    if (missingCategories.length === 0) {
      console.log("\nAll required categories exist!");
    } else {
      console.log(`\nFound ${missingCategories.length} missing categories:`);
      for (const category of missingCategories) {
        console.log(`- ${category.name}`);
      }
      
      // Ask for confirmation before creating
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('\nDo you want to create these missing categories? (yes/no): ', resolve);
      });
      
      if (answer.toLowerCase() === 'yes') {
        console.log("\nCreating missing categories...");
        
        // 4. Create missing categories
        let createdCount = 0;
        for (const category of missingCategories) {
          try {
            const result = await convexMutation(CONVEX_URL, "categories:add", { 
              category: {
                name: category.name,
                description: category.description
              }
            });
            
            if (result && result._id) {
              console.log(`- Created: ${category.name} (ID: ${result._id})`);
              createdCount++;
            } else {
              console.error(`- Failed to create: ${category.name}`);
            }
          } catch (error) {
            console.error(`- Error creating ${category.name}: ${error.message}`);
          }
        }
        
        console.log(`\nCreated ${createdCount} out of ${missingCategories.length} missing categories`);
      } else {
        console.log("Operation cancelled by user");
      }
      
      readline.close();
    }
    
    // 5. Check for businesses with invalid categories
    console.log("\nChecking for businesses with invalid categories...");
    const businesses = await convexQuery(CONVEX_URL, "businesses:getAll");
    console.log(`Found ${businesses.length} total businesses`);
    
    // Get updated category list
    const updatedCategories = await convexQuery(CONVEX_URL, "categories:getAll");
    const validCategoryIds = new Set(updatedCategories.map(c => c._id));
    
    // Find businesses with invalid categories
    const invalidBusinesses = businesses.filter(b => !validCategoryIds.has(b.categoryId));
    
    if (invalidBusinesses.length === 0) {
      console.log("All businesses have valid category IDs!");
    } else {
      console.log(`Found ${invalidBusinesses.length} businesses with invalid category IDs`);
      console.log("You should run fix-business-categories.js to fix these issues");
    }
    
    console.log("\nValidation complete!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
}); 