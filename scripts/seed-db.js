#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Seeding Fulshear Local database...');

try {
  console.log('Starting Convex to run seed mutation...');
  execSync('npx convex run seed:seedDatabase', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully!');
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  console.log('Make sure your Convex deployment is properly set up and running.');
  process.exit(1);
} 