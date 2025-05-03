#!/usr/bin/env node

/**
 * Script to generate comprehensive JSON file with businesses for each category
 * Uses Google Maps Places API to fetch real business data for Fulshear, TX
 * 
 * Usage: 
 * node generate-all-category-businesses.js <GOOGLE_API_KEY>
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Check for API key argument
if (process.argv.length < 3) {
  console.error('Error: Google API key required');
  console.error('Usage: node generate-all-category-businesses.js <GOOGLE_API_KEY>');
  process.exit(1);
}

const GOOGLE_API_KEY = process.argv[2];

// Category definitions with search terms specific to Fulshear, TX
const categories = [
  {
    name: "Restaurants",
    icon: "utensils",
    searchTerms: [
      "restaurants in Fulshear TX",
      "cafes in Fulshear TX",
      "bakery in Fulshear TX",
      "food in Fulshear TX"
    ]
  },
  {
    name: "Shopping",
    icon: "shopping-bag",
    searchTerms: [
      "shopping in Fulshear TX",
      "stores in Fulshear TX",
      "grocery in Fulshear TX",
      "boutique in Fulshear TX"
    ]
  },
  {
    name: "Medical & Dental",
    icon: "hospital",
    searchTerms: [
      "doctor in Fulshear TX",
      "dentist in Fulshear TX",
      "medical clinic in Fulshear TX",
      "healthcare in Fulshear TX"
    ]
  },
  {
    name: "Beauty & Wellness",
    icon: "spa",
    searchTerms: [
      "salon in Fulshear TX",
      "spa in Fulshear TX",
      "beauty in Fulshear TX",
      "hair stylist in Fulshear TX"
    ]
  },
  {
    name: "Financial Services",
    icon: "dollar-sign",
    searchTerms: [
      "bank in Fulshear TX",
      "financial advisor in Fulshear TX",
      "insurance in Fulshear TX",
      "tax in Fulshear TX"
    ]
  },
  {
    name: "Real Estate",
    icon: "home",
    searchTerms: [
      "real estate in Fulshear TX",
      "realtor in Fulshear TX",
      "property management in Fulshear TX",
      "apartments in Fulshear TX"
    ]
  },
  {
    name: "Automotive",
    icon: "car",
    searchTerms: [
      "automotive in Fulshear TX",
      "car repair in Fulshear TX",
      "mechanic in Fulshear TX",
      "auto dealer in Fulshear TX"
    ]
  },
  {
    name: "Professional Services",
    icon: "briefcase",
    searchTerms: [
      "lawyer in Fulshear TX",
      "professional services in Fulshear TX",
      "accounting in Fulshear TX",
      "consultant in Fulshear TX"
    ]
  },
  {
    name: "Childcare & Education",
    icon: "school",
    searchTerms: [
      "school in Fulshear TX",
      "daycare in Fulshear TX",
      "childcare in Fulshear TX",
      "education in Fulshear TX"
    ]
  },
  {
    name: "Religious Organizations",
    icon: "church",
    searchTerms: [
      "church in Fulshear TX",
      "religious organization in Fulshear TX",
      "worship in Fulshear TX",
      "temple in Fulshear TX"
    ]
  },
  {
    name: "Sports & Fitness",
    icon: "running",
    searchTerms: [
      "gym in Fulshear TX",
      "fitness in Fulshear TX",
      "sports in Fulshear TX",
      "personal trainer in Fulshear TX"
    ]
  },
  {
    name: "Recreation & Entertainment",
    icon: "umbrella-beach",
    searchTerms: [
      "recreation in Fulshear TX",
      "entertainment in Fulshear TX",
      "park in Fulshear TX",
      "theater in Fulshear TX"
    ]
  },
  {
    name: "Home Services",
    icon: "tools",
    searchTerms: [
      "plumber in Fulshear TX",
      "electrician in Fulshear TX",
      "contractor in Fulshear TX",
      "home repair in Fulshear TX"
    ]
  }
];

// Fulshear, TX coordinates
const FULSHEAR_LOCATION = "29.6936,-95.8883"; // Latitude,Longitude
const FULSHEAR_RADIUS = 10000; // 10km radius to cover Fulshear and nearby areas

// Track processed businesses to avoid duplicates
const processedPlaceIds = new Set();
const allBusinesses = {};

async function searchPlaces(searchTerm) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(searchTerm);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${GOOGLE_API_KEY}`;
    
    https.get(url, response => {
      let data = '';
      
      response.on('data', chunk => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const searchResults = JSON.parse(data);
          
          if (searchResults.status !== 'OK') {
            console.warn(`Warning: API returned status ${searchResults.status} for query "${searchTerm}"`);
            resolve([]);
            return;
          }
          
          resolve(searchResults.results);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function getPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,opening_hours,geometry,place_id&key=${GOOGLE_API_KEY}`;
    
    https.get(url, response => {
      let data = '';
      
      response.on('data', chunk => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const detailsResults = JSON.parse(data);
          
          if (detailsResults.status !== 'OK') {
            console.warn(`Warning: API returned status ${detailsResults.status} for place ID ${placeId}`);
            resolve(null);
            return;
          }
          
          resolve(detailsResults.result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function processCategory(category) {
  console.log(`\nProcessing category: ${category.name}`);
  const businesses = [];

  // Process each search term for this category
  for (const searchTerm of category.searchTerms) {
    try {
      console.log(`  Searching for: ${searchTerm}`);
      const places = await searchPlaces(searchTerm);
      console.log(`  Found ${places.length} places`);
      
      // Process each place
      for (const place of places) {
        // Skip if already processed
        if (processedPlaceIds.has(place.place_id)) {
          console.log(`  Skipping duplicate: ${place.name}`);
          continue;
        }
        
        // Skip if not in Fulshear
        if (!place.formatted_address.toLowerCase().includes('fulshear') && 
            !place.formatted_address.toLowerCase().includes('tx 77441')) {
          console.log(`  Skipping non-Fulshear business: ${place.name}`);
          continue;
        }
        
        processedPlaceIds.add(place.place_id);
        
        // Get additional details
        console.log(`  Getting details for: ${place.name}`);
        const details = await getPlaceDetails(place.place_id);
        
        if (!details) {
          console.log(`  Could not get details for ${place.name}`);
          continue;
        }
        
        // Format hours if available
        let hours = [];
        if (details.opening_hours && details.opening_hours.weekday_text) {
          hours = details.opening_hours.weekday_text;
        }
        
        // Create business object
        const business = {
          name: details.name,
          address: details.formatted_address,
          phoneNumber: details.formatted_phone_number || "",
          website: details.website || "",
          categoryName: category.name,
          rating: details.rating || 4.5, // Default if not available
          hours: hours,
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          placeId: details.place_id
        };
        
        businesses.push(business);
        console.log(`  Added: ${business.name}`);
      }
    } catch (error) {
      console.error(`Error processing search term "${searchTerm}":`, error.message);
    }
    
    // Add a short delay to avoid hitting API limits
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return businesses;
}

async function main() {
  console.log('Starting business data collection for Fulshear, TX');
  console.log(`Using Google API Key: ${GOOGLE_API_KEY.substring(0, 5)}...${GOOGLE_API_KEY.substring(GOOGLE_API_KEY.length - 5)}`);
  
  // Process each category
  for (const category of categories) {
    const categoryBusinesses = await processCategory(category);
    allBusinesses[category.name] = categoryBusinesses;
    
    console.log(`Collected ${categoryBusinesses.length} businesses for ${category.name}`);
    
    // Add a delay between categories to respect API limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Count total businesses
  const totalBusinesses = Object.values(allBusinesses).reduce((total, businesses) => total + businesses.length, 0);
  console.log(`\nCollection complete! Found ${totalBusinesses} businesses across ${categories.length} categories.`);
  
  // Save to file
  const outputFile = path.join(__dirname, '..', 'data', 'fulshear-businesses.json');
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(
    outputFile, 
    JSON.stringify({ 
      businesses: allBusinesses, 
      metadata: {
        generatedAt: new Date().toISOString(),
        totalCategories: categories.length,
        totalBusinesses: totalBusinesses
      }
    }, null, 2)
  );
  
  console.log(`Data saved to ${outputFile}`);
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 