#!/usr/bin/env node

/**
 * Script to import generated business data into Convex database
 * Uses the businesses:add mutation to add businesses from the JSON file
 * 
 * Usage: 
 * node import-generated-businesses.js [path/to/businesses.json]
 */

const fs = require('fs');
const path = require('path');
const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Get the Convex URL from .env.local or use the default
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';
const client = new ConvexHttpClient(CONVEX_URL);

// Get file path from command line or use default
const dataFilePath = process.argv[2] || path.join(__dirname, '..', 'data', 'fulshear-businesses.json');

// Function to get all categories to map names to IDs
async function getCategoryMap() {
  try {
    console.log('Fetching categories...');
    const categories = await client.query('categories:getAll');
    
    const categoryMap = new Map();
    for (const category of categories) {
      categoryMap.set(category.name, category._id);
    }
    
    console.log(`Found ${categoryMap.size} categories`);
    return categoryMap;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Function to get existing businesses to avoid duplicates
async function getExistingPlaceIds() {
  try {
    console.log('Fetching existing businesses...');
    const businesses = await client.query('businesses:getAll');
    
    const placeIdSet = new Set();
    for (const business of businesses) {
      if (business.placeId) {
        placeIdSet.add(business.placeId);
      }
    }
    
    console.log(`Found ${placeIdSet.size} existing businesses`);
    return placeIdSet;
  } catch (error) {
    console.error('Error fetching existing businesses:', error);
    throw error;
  }
}

// Main function to import businesses
async function importBusinesses() {
  try {
    console.log(`Importing businesses from ${dataFilePath}`);
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error(`Error: File not found: ${dataFilePath}`);
      console.error('Generate the file first using generate-all-category-businesses.js');
      process.exit(1);
    }
    
    // Read and parse the data file
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);
    
    if (!data.businesses) {
      console.error('Error: Invalid data format. Missing "businesses" property.');
      process.exit(1);
    }
    
    // Get category mapping
    const categoryMap = await getCategoryMap();
    
    // Get existing place IDs to avoid duplicates
    const existingPlaceIds = await getExistingPlaceIds();
    
    // Statistics tracking
    const stats = {
      totalProcessed: 0,
      added: 0,
      skipped: 0,
      error: 0,
      byCategory: {}
    };
    
    // Process each category
    for (const [categoryName, businesses] of Object.entries(data.businesses)) {
      console.log(`\nProcessing category: ${categoryName}`);
      
      // Get category ID from map
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) {
        console.warn(`Warning: Category "${categoryName}" not found in database. Skipping ${businesses.length} businesses.`);
        stats.skipped += businesses.length;
        stats.totalProcessed += businesses.length;
        continue;
      }
      
      // Initialize category stats
      stats.byCategory[categoryName] = {
        processed: 0,
        added: 0,
        skipped: 0,
        error: 0
      };
      
      // Process each business
      for (const business of businesses) {
        stats.totalProcessed++;
        stats.byCategory[categoryName].processed++;
        
        // Skip if already exists
        if (existingPlaceIds.has(business.placeId)) {
          console.log(`  Skipping existing business: ${business.name}`);
          stats.skipped++;
          stats.byCategory[categoryName].skipped++;
          continue;
        }
        
        try {
          // Add business to database
          console.log(`  Adding business: ${business.name}`);
          
          await client.mutation('businesses:add', {
            business: {
              name: business.name,
              address: business.address,
              phoneNumber: business.phoneNumber || undefined,
              website: business.website || undefined,
              categoryId: categoryId,
              rating: business.rating || undefined,
              hours: business.hours || undefined,
              latitude: business.latitude,
              longitude: business.longitude,
              placeId: business.placeId,
              lastUpdated: Date.now()
            }
          });
          
          stats.added++;
          stats.byCategory[categoryName].added++;
          console.log(`  Added successfully: ${business.name}`);
          
          // Add a short delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`  Error adding business "${business.name}":`, error.message);
          stats.error++;
          stats.byCategory[categoryName].error++;
        }
      }
      
      // Summary for category
      console.log(`Completed ${categoryName}: Added ${stats.byCategory[categoryName].added}, Skipped ${stats.byCategory[categoryName].skipped}, Errors ${stats.byCategory[categoryName].error}`);
    }
    
    // Final summary
    console.log('\n=== Import Summary ===');
    console.log(`Total businesses processed: ${stats.totalProcessed}`);
    console.log(`Added: ${stats.added}`);
    console.log(`Skipped (already exists): ${stats.skipped}`);
    console.log(`Errors: ${stats.error}`);
    console.log('\nBy Category:');
    
    for (const [category, catStats] of Object.entries(stats.byCategory)) {
      if (catStats.processed > 0) {
        console.log(`  ${category}: Added ${catStats.added}, Skipped ${catStats.skipped}, Errors ${catStats.error}`);
      }
    }
    
    console.log('\nImport completed!');
    
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

// Run the import
importBusinesses(); 