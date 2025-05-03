const fs = require('fs');
const path = require('path');
const https = require('https');

// Define the categories and image URLs
// Using Unsplash source for placeholder images (free to use)
const categoryImages = [
  {
    name: 'restaurants',
    url: 'https://source.unsplash.com/random/800x600/?restaurant,food'
  },
  {
    name: 'shopping',
    url: 'https://source.unsplash.com/random/800x600/?shopping,retail'
  },
  {
    name: 'medical',
    url: 'https://source.unsplash.com/random/800x600/?medical,healthcare'
  },
  {
    name: 'beauty',
    url: 'https://source.unsplash.com/random/800x600/?beauty,salon'
  },
  {
    name: 'financial',
    url: 'https://source.unsplash.com/random/800x600/?finance,bank'
  },
  {
    name: 'real-estate',
    url: 'https://source.unsplash.com/random/800x600/?realestate,house'
  },
  {
    name: 'automotive',
    url: 'https://source.unsplash.com/random/800x600/?automotive,car'
  },
  {
    name: 'professional',
    url: 'https://source.unsplash.com/random/800x600/?office,professional'
  },
  {
    name: 'education',
    url: 'https://source.unsplash.com/random/800x600/?education,school'
  },
  {
    name: 'religious',
    url: 'https://source.unsplash.com/random/800x600/?church,worship'
  },
  {
    name: 'fitness',
    url: 'https://source.unsplash.com/random/800x600/?fitness,gym'
  },
  {
    name: 'entertainment',
    url: 'https://source.unsplash.com/random/800x600/?entertainment,fun'
  },
  {
    name: 'home-services',
    url: 'https://source.unsplash.com/random/800x600/?homeservice,repair'
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