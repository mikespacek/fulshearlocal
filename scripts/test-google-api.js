#!/usr/bin/env node

/**
 * Simple script to test the Google Places API connection
 * Usage: node test-google-api.js
 */

const https = require('https');

// Use the provided API key
const GOOGLE_API_KEY = 'AIzaSyABzht1PL3Ze8HIYQLmualN-fM800vw_HI';

// Function to test a simple Places API search
async function testPlacesAPI() {
  return new Promise((resolve, reject) => {
    const searchTerm = encodeURIComponent('restaurants in Fulshear TX');
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchTerm}&key=${GOOGLE_API_KEY}`;
    
    console.log(`Making request to: ${url.replace(GOOGLE_API_KEY, 'API_KEY_HIDDEN')}`);
    
    https.get(url, response => {
      let data = '';
      
      response.on('data', chunk => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  console.log('Testing Google Places API connection...');
  
  try {
    const result = await testPlacesAPI();
    
    console.log(`API Status: ${result.status}`);
    
    if (result.status === 'OK') {
      console.log(`Success! Found ${result.results.length} places.`);
      
      if (result.results.length > 0) {
        console.log('\nFirst result:');
        console.log(`Name: ${result.results[0].name}`);
        console.log(`Address: ${result.results[0].formatted_address}`);
        console.log(`Rating: ${result.results[0].rating}`);
      }
      
      console.log('\nGoogle Places API is working correctly!');
    } else {
      console.error(`API returned error status: ${result.status}`);
      if (result.error_message) {
        console.error(`Error message: ${result.error_message}`);
      }
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
main(); 