// Simple script to add businesses to empty categories
const https = require('https');
const url = require('url');

// Configuration
const CONVEX_URL = 'https://rosy-cow-217.convex.cloud';
const ADMIN_KEY = 'fulshear_admin_secret_key';

// Process command line arguments
const args = process.argv.slice(2);
const adminKeyArg = args.find(arg => arg.startsWith('--adminKey='));
const adminKey = adminKeyArg ? adminKeyArg.split('=')[1] : ADMIN_KEY;

console.log('Adding businesses to empty categories...');
console.log(`Using Convex URL: ${CONVEX_URL}`);

// Parse the Convex URL
const parsedUrl = url.parse(CONVEX_URL);

// Prepare the request data
const postData = JSON.stringify({
  action: {
    type: "mutation",
    path: "addMissingBusinesses:addBusinessesToEmptyCategories",
    args: { adminKey }
  }
});

// Prepare the request options
const options = {
  hostname: parsedUrl.hostname,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

// Make the request
const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      if (result.error) {
        console.error('Error:', result.error);
      } else {
        console.log('Result:', result);
        console.log('Successfully added businesses to empty categories!');
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Error making request:', e);
});

// Send the request
req.write(postData);
req.end(); 