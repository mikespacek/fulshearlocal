const fs = require('fs');
const path = require('path');
const https = require('https');

// Define the categories and image URLs
// Using specific Unsplash image URLs instead of random ones
const categoryImages = [
  {
    name: 'restaurants',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'shopping',
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'medical',
    url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'beauty',
    url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'financial',
    url: 'https://images.unsplash.com/photo-1607944024060-0450380ddd33?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'real-estate',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'automotive',
    url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'professional',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'education',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'religious',
    url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'fitness',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'entertainment',
    url: 'https://images.unsplash.com/photo-1593959734793-6e92d102da1e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  },
  {
    name: 'home-services',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800'
  }
];

// Create the directory if it doesn't exist
const imageDir = path.join(__dirname, '../public/category-images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log(`Created directory: ${imageDir}`);
}

// Function to download an image
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // If we get redirected, follow the redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Check if response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }
      
      // Create a write stream to save the image
      const fileStream = fs.createWriteStream(filePath);
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      // Handle errors
      fileStream.on('error', (err) => {
        reject(err);
      });
      
      // When the download is complete, resolve the promise
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded image to: ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting download of category images...');
  
  for (const category of categoryImages) {
    const filePath = path.join(imageDir, `${category.name}.jpg`);
    
    try {
      await downloadImage(category.url, filePath);
      console.log(`Successfully downloaded image for ${category.name}`);
    } catch (error) {
      console.error(`Error downloading image for ${category.name}:`, error.message);
    }
  }
  
  console.log('All image downloads complete!');
}

// Run the download function
downloadAllImages().catch(err => {
  console.error('Download failed:', err);
}); 