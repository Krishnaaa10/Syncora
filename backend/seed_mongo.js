// One-time seeding script to populate MongoDB from seed.json
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const Store = require('./models/Store');
const Product = require('./models/Product');
const User = require('./models/User');
const Seller = require('./models/Seller');

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Clear existing data
  await Store.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await Seller.deleteMany({});
  console.log('Cleared existing data');

  // Load seed data
  const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8'));

  // Insert stores
  await Store.insertMany(seedData.stores);
  console.log(`Inserted ${seedData.stores.length} stores`);

  // Insert products
  await Product.insertMany(seedData.products);
  console.log(`Inserted ${seedData.products.length} products`);

  // Seed demo user
  const demoPasswordHash = await bcrypt.hash('demo123', 10);
  await User.create({
    id: 'user1',
    name: 'Demo User',
    email: 'demo@syncora.com',
    passwordHash: demoPasswordHash
  });
  console.log('Demo user created: demo@syncora.com / demo123');

  // Seed demo seller (linked to MNR01 from seed data - check if that store exists)
  const firstStore = seedData.stores[0];
  const demoSellerPasswordHash = await bcrypt.hash('seller123', 10);
  await Seller.create({
    id: 'seller1',
    name: 'Demo Seller',
    email: 'seller@syncora.com',
    passwordHash: demoSellerPasswordHash,
    storeId: firstStore ? firstStore.Store_ID : 'MNR01'
  });
  console.log('Demo seller created: seller@syncora.com / seller123');

  console.log('\nSeeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
