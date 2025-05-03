const fs = require('fs');
const path = require('path');
const https = require('https');

// Define the categories and image URLs - using specific Unsplash photos (no random)
// Each image is completely unique to avoid any duplicates
const categoryImages = [
  {
    name: 'restaurants',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Fine dining restaurant with elegant table settings'
  },
  {
    name: 'shopping',
    url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Vibrant shopping district with storefronts'
  },
  {
    name: 'medical',
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Modern medical facility with healthcare professionals'
  },
  {
    name: 'beauty',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Beauty salon with professional styling equipment'
  },
  {
    name: 'financial',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Financial district with modern office buildings'
  },
  {
    name: 'real-estate',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Luxury home with contemporary architecture'
  },
  {
    name: 'automotive',
    url: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Modern car dealership with luxury vehicles'
  },
  {
    name: 'professional',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Professional business meeting in a corporate setting'
  },
  {
    name: 'education',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Elementary school classroom with desks and supplies'
  },
  {
    name: 'religious',
    url: 'https://images.unsplash.com/photo-1545111796-c4facd884bcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Beautiful church interior with stained glass'
  },
  {
    name: 'fitness',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Modern gym with fitness equipment and people exercising'
  },
  {
    name: 'entertainment',
    url: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Concert venue with colorful stage lights and audience'
  },
  {
    name: 'home-services',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Professional home service provider at work'
  },
  {
    name: 'default',
    url: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Downtown Fulshear shopping district'
  }
];

// Ensure the directory exists
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

// Create a mapping of image descriptions to be used later
function createImageDescriptionMapping() {
  const descriptionMapping = {};
  
  for (const category of categoryImages) {
    descriptionMapping[category.name] = category.description;
  }
  
  // Write the mapping to a file
  fs.writeFileSync(
    path.join(__dirname, '../public/category-images/descriptions.json'),
    JSON.stringify(descriptionMapping, null, 2)
  );
  
  console.log('Created image description mapping file');
}

// Download all images
async function downloadAllImages() {
  console.log('Starting download of high-quality category images...');
  
  // Create backup folder for old images
  const backupDir = path.join(imageDir, 'backup-' + Date.now());
  fs.mkdirSync(backupDir, { recursive: true });
  
  // Backup existing images
  const existingImages = fs.readdirSync(imageDir).filter(file => file.endsWith('.jpg'));
  for (const file of existingImages) {
    const sourcePath = path.join(imageDir, file);
    const backupPath = path.join(backupDir, file);
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`Backed up ${file} to ${backupPath}`);
  }
  
  for (const category of categoryImages) {
    const filePath = path.join(imageDir, `${category.name}.jpg`);
    
    try {
      await downloadImage(category.url, filePath);
      console.log(`Successfully downloaded image for ${category.name}`);
    } catch (error) {
      console.error(`Error downloading image for ${category.name}:`, error.message);
    }
  }
  
  // Create the description mapping
  createImageDescriptionMapping();
  
  console.log('All image downloads complete!');
}

// Run the download
downloadAllImages(); 