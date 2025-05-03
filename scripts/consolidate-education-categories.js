#!/usr/bin/env node

/**
 * Script to consolidate Education categories by moving all businesses 
 * from the "Education" category to the "Childcare & Education" category
 */

const { ConvexHttpClient } = require('convex/browser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Constants
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';

// Source and target category IDs
const EDUCATION_CATEGORY_ID = 'j97cncg48vdmz7xwpqxzwty15d7f6wb5';
const CHILDCARE_EDUCATION_CATEGORY_ID = 'j97fzv5drz4pbtdwg7q7dwc6ws7f75cw';

// Initialize Convex client
const client = new ConvexHttpClient(CONVEX_URL);

async function consolidateCategories() {
  console.log('Starting category consolidation...');
  
  try {
    // 1. Get all businesses from the Education category
    const educationBusinesses = await client.query('businesses:getByCategory', { 
      categoryId: EDUCATION_CATEGORY_ID 
    });
    
    console.log(`Found ${educationBusinesses.length} businesses in the Education category`);
    
    // 2. Move each business to the Childcare & Education category
    let movedCount = 0;
    
    for (const business of educationBusinesses) {
      try {
        // Create clean business object without Convex internal fields
        const cleanBusiness = {
          name: business.name,
          address: business.address,
          phoneNumber: business.phoneNumber,
          website: business.website,
          categoryId: CHILDCARE_EDUCATION_CATEGORY_ID, // Use the new category ID
          rating: business.rating,
          hours: business.hours,
          latitude: business.latitude,
          longitude: business.longitude,
          placeId: business.placeId,
          lastUpdated: Date.now()
        };
        
        // Add optional fields only if they exist in the original
        if (business.photos) cleanBusiness.photos = business.photos;
        if (business.description) cleanBusiness.description = business.description;
        
        // Add the business with the new category
        await client.mutation('businesses:add', { business: cleanBusiness });
        
        // Delete the old business
        await client.mutation('businesses:deleteById', { id: business._id });
        
        console.log(`Moved: ${business.name}`);
        movedCount++;
      } catch (error) {
        console.error(`Error moving business "${business.name}":`, error);
      }
    }
    
    console.log(`\nSuccessfully moved ${movedCount}/${educationBusinesses.length} businesses`);
    console.log(`Businesses from the Education category are now in the "Childcare & Education" category`);
    
  } catch (error) {
    console.error('Consolidation failed:', error);
  }
}

// Run the consolidation
consolidateCategories(); 