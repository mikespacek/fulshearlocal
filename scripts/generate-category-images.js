const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Define the categories with colors and icons
const categories = [
  { name: 'restaurants', color: '#FF6B6B', text: '🍽️' },
  { name: 'shopping', color: '#4ECDC4', text: '🛍️' },
  { name: 'medical', color: '#1A535C', text: '🏥' },
  { name: 'beauty', color: '#FF9A8B', text: '💇' },
  { name: 'financial', color: '#2D4059', text: '💰' },
  { name: 'real-estate', color: '#6A4C93', text: '🏠' },
  { name: 'automotive', color: '#F7B801', text: '🚗' },
  { name: 'professional', color: '#7A9E9F', text: '💼' },
  { name: 'education', color: '#4056A1', text: '🎓' },
  { name: 'religious', color: '#6B7A8F', text: '⛪' },
  { name: 'fitness', color: '#66DE93', text: '💪' },
  { name: 'entertainment', color: '#F13C77', text: '🎭' },
  { name: 'home-services', color: '#2C3E50', text: '🔧' }
];

// Create directory if it doesn't exist
const imageDir = path.join(__dirname, '../public/category-images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log(`Created directory: ${imageDir}`);
}

// Function to generate an image
function generateImage(category) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background with category color
  ctx.fillStyle = category.color;
  ctx.fillRect(0, 0, width, height);

  // Add a pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < width; i += 20) {
    for (let j = 0; j < height; j += 20) {
      if ((i + j) % 40 === 0) {
        ctx.fillRect(i, j, 10, 10);
      }
    }
  }

  // Add category name
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(category.name.toUpperCase(), width / 2, height / 2 - 40);

  // Add emoji
  ctx.font = '120px Arial';
  ctx.fillText(category.text, width / 2, height / 2 + 80);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  const filePath = path.join(imageDir, `${category.name}.jpg`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated image for ${category.name}`);
}

// Generate all category images
function generateAllImages() {
  console.log('Generating category images...');
  
  categories.forEach(category => {
    try {
      generateImage(category);
    } catch (error) {
      console.error(`Error generating image for ${category.name}:`, error.message);
    }
  });
  
  console.log('All images generated!');
}

// Run the generator
generateAllImages(); 