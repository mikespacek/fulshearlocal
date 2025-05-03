#!/usr/bin/env node

/**
 * Import businesses from fulshear-businesses.json to Convex database
 * Usage: node import-businesses.js
 */

const fs = require('fs');
const path = require('path');
const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Constants
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';
const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'fulshear-businesses.json');

// Initialize Convex client
const client = new ConvexHttpClient(CONVEX_URL);

// Import statistics
const stats = {
  total: 0,
  imported: 0,
  skipped: 0,
  errors: 0,
  categoriesProcessed: new Set()
};

// Load and parse business data
async function loadBusinessData() {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load business data:', error);
    process.exit(1);
  }
}

// Get all categories from database
async function getCategoryMap() {
  try {
    console.log('Fetching categories from database...');
    const categories = await client.query('categories:getAll');
    
    const categoryMap = new Map();
    for (const category of categories) {
      categoryMap.set(category.name, category._id);
    }
    
    console.log(`Found ${categoryMap.size} categories in database`);
    return categoryMap;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Get existing businesses to avoid duplicates
async function getExistingBusinesses() {
  try {
    console.log('Fetching existing businesses...');
    const businesses = await client.query('businesses:list');
    
    const existingBusinessMap = new Map();
    for (const business of businesses) {
      existingBusinessMap.set(business.placeId, business);
    }
    
    console.log(`Found ${existingBusinessMap.size} existing businesses`);
    return existingBusinessMap;
  } catch (error) {
    console.error('Error fetching existing businesses:', error);
    throw error;
  }
}

// Main function to import businesses
async function importBusinesses() {
  console.log('Starting import process...');
  
  try {
    // Load business data from file
    const data = await loadBusinessData();
    console.log(`Loaded data with ${Object.keys(data.businesses).length} categories`);
    
    // Get category mapping from database
    const categoryMap = await getCategoryMap();
    
    // Get existing businesses to avoid duplicates
    const existingBusinessMap = await getExistingBusinesses();
    
    // Process each category and its businesses
    for (const [categoryName, businesses] of Object.entries(data.businesses)) {
      stats.categoriesProcessed.add(categoryName);
      
      // Check if category exists in database
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) {
        console.warn(`Category not found in database: ${categoryName}, skipping ${businesses.length} businesses`);
        stats.skipped += businesses.length;
        continue;
      }
      
      console.log(`Processing category: ${categoryName} (${businesses.length} businesses)`);
      
      // Process each business in the category
      for (const business of businesses) {
        stats.total++;
        
        // Check if business already exists
        if (existingBusinessMap.has(business.placeId)) {
          console.log(`Business already exists: ${business.name}, skipping`);
          stats.skipped++;
          continue;
        }
        
        try {
          // Prepare business data for insertion
          const businessData = {
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
          };
          
          // Insert business into database
          await client.mutation('businesses:add', { business: businessData });
          stats.imported++;
          
          // Log progress periodically
          if (stats.imported % 10 === 0) {
            console.log(`Progress: ${stats.imported}/${stats.total} businesses imported`);
          }
        } catch (error) {
          console.error(`Error importing business "${business.name}":`, error);
          stats.errors++;
        }
      }
    }
    
    // Report results
    console.log('\nImport completed:');
    console.log(`- Categories processed: ${stats.categoriesProcessed.size}`);
    console.log(`- Total businesses: ${stats.total}`);
    console.log(`- Successfully imported: ${stats.imported}`);
    console.log(`- Skipped (duplicates): ${stats.skipped}`);
    console.log(`- Errors: ${stats.errors}`);
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run the import
importBusinesses(); 