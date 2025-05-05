#!/usr/bin/env node

// This simple script checks your Convex database to see how many businesses and categories exist
// It's designed to work with minimal dependencies
const https = require('https');

// Configure the Convex URL - change as needed
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';

// List of approved categories that should be showing on the site
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

// Simple function to make a POST request to Convex
function convexQuery(url, query, args = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      reflectionQuery: query,
      args
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(url, options, (res) => {
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

async function main() {
  console.log("Convex Database Check Tool");
  console.log("==========================");
  console.log(`Convex URL: ${CONVEX_URL}`);
  
  // Prep the URL for Convex API
  const apiUrl = `${CONVEX_URL}/api/query`;
  
  try {
    // 1. Get all businesses
    console.log("\nQuerying businesses...");
    const businesses = await convexQuery(apiUrl, "businesses:getAll");
    console.log(`Found ${businesses.length} businesses total`);
    
    // 2. Get all categories
    console.log("\nQuerying categories...");
    const categories = await convexQuery(apiUrl, "categories:getAll");
    console.log(`Found ${categories.length} categories total`);
    
    // Create maps for easy lookup
    const categoryNameById = {};
    const categoryIdByName = {};
    
    for (const category of categories) {
      categoryNameById[category._id] = category.name;
      categoryIdByName[category.name] = category._id;
    }
    
    // 3. Count businesses by category
    const businessesByCategory = {};
    let businessesWithoutValidCategory = 0;
    
    for (const business of businesses) {
      const categoryName = categoryNameById[business.categoryId];
      
      if (categoryName) {
        businessesByCategory[categoryName] = (businessesByCategory[categoryName] || 0) + 1;
        
        if (!APPROVED_CATEGORIES.includes(categoryName)) {
          businessesWithoutValidCategory++;
        }
      } else {
        businessesWithoutValidCategory++;
      }
    }
    
    // 4. Print business counts by category
    console.log("\nBusinesses by Category:");
    
    let totalApprovedBusinesses = 0;
    for (const category of APPROVED_CATEGORIES) {
      const count = businessesByCategory[category] || 0;
      totalApprovedBusinesses += count;
      console.log(`- ${category}: ${count}`);
    }
    
    // 5. Print summary
    console.log("\nSummary:");
    console.log(`- Total businesses: ${businesses.length}`);
    console.log(`- Businesses in approved categories: ${totalApprovedBusinesses}`);
    console.log(`- Businesses in unapproved categories: ${businessesWithoutValidCategory}`);
    
    // 6. Check for missing approved categories
    console.log("\nChecking for missing approved categories:");
    for (const category of APPROVED_CATEGORIES) {
      if (!categoryIdByName[category]) {
        console.log(`- MISSING: "${category}" category is not in the database!`);
      }
    }
    
    console.log("\nAnalysis complete!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
}); 