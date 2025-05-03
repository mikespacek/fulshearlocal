#!/usr/bin/env node

/**
 * Script to delete the empty Education category
 */

const { ConvexHttpClient } = require('convex/browser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Constants
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://rosy-cow-217.convex.cloud';

// Education category ID
const EDUCATION_CATEGORY_ID = 'j97cncg48vdmz7xwpqxzwty15d7f6wb5';

// Initialize Convex client
const client = new ConvexHttpClient(CONVEX_URL);

async function deleteEducationCategory() {
  console.log('Deleting empty Education category...');
  
  try {
    // Check if any businesses are still in the Education category
    const educationBusinesses = await client.query('businesses:getByCategory', { 
      categoryId: EDUCATION_CATEGORY_ID 
    });
    
    console.log(`Found ${educationBusinesses.length} businesses in the Education category`);
    
    if (educationBusinesses.length > 0) {
      console.log(`Cannot delete category: Still has ${educationBusinesses.length} businesses`);
      return;
    }
    
    // Delete the category
    const result = await client.mutation('categories:deleteById', { 
      id: EDUCATION_CATEGORY_ID 
    });
    
    if (result.success) {
      console.log(`Successfully deleted the Education category: ${result.message}`);
    } else {
      console.log(`Failed to delete the Education category: ${result.message}`);
    }
    
  } catch (error) {
    console.error('Delete category failed:', error);
  }
}

// Run the delete operation
deleteEducationCategory(); 