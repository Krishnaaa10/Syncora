// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Import Models
const User = require('./models/User');
const Seller = require('./models/Seller');
const Store = require('./models/Store');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('[socket] Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('[socket] Client disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected');
  
  // Seed Database if empty
  const storeCount = await Store.countDocuments();
  if (storeCount === 0) {
    console.log('Database empty. Seeding data...');
    const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8'));
    await Store.insertMany(seedData.stores);
    await Product.insertMany(seedData.products);
    
    // Seed demo user
    const demoPasswordHash = await bcrypt.hash('demo123', 10);
    await User.create({
      id: 'user1',
      name: 'Demo User',
      email: 'demo@syncora.com',
      passwordHash: demoPasswordHash
    });
    
    // Seed demo seller
    const firstStore = seedData.stores[0];
    const demoSellerPasswordHash = await bcrypt.hash('seller123', 10);
    await Seller.create({
      id: 'seller1',
      name: 'Demo Seller',
      email: 'seller@syncora.com',
      passwordHash: demoSellerPasswordHash,
      storeId: firstStore ? firstStore.Store_ID : 'MNR01'
    });
    console.log('Seeding complete.');
  }

  // Start the server ONLY after MongoDB is connected
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});


// Email transporter setup (for contact form)
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  console.log('Email service configured');
} else {
  console.log('Email service not configured - GMAIL_USER and GMAIL_APP_PASSWORD not set in .env');
}

// Google OAuth client (you'll need to set these in environment variables)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Syncora API Server with MongoDB',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      login: 'POST /auth/login',
      brands: 'GET /brands',
      stores: 'GET /brands/:brandId/stores',
      products: 'GET /stores/:storeId/products',
      product: 'GET /products/:itemId',
      orders: 'POST /orders, GET /orders/:orderId'
    }
  });
});

// Auth endpoints
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  
  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      id: uuidv4(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: passwordHash
    });
    
    await newUser.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;
    delete userResponse._id;
    delete userResponse.__v;
    
    res.json({
      token: 'jwt-token-' + Date.now(), // Still mock JWT for user
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  
  try {
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Please sign in with Google or reset your password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    delete userResponse._id;
    delete userResponse.__v;
    
    res.json({
      token: 'jwt-token-' + Date.now(),
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth endpoint
app.post('/auth/google', async (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }
  
  if (!googleClient || !GOOGLE_CLIENT_ID) {
    console.warn('Google OAuth not configured. Using mock authentication.');
    const mockEmail = 'google.user@example.com';
    
    try {
      let user = await User.findOne({ email: mockEmail });
      
      if (!user) {
        user = new User({
          id: uuidv4(),
          name: 'Google User',
          email: mockEmail,
          googleId: 'mock-google-id'
        });
        await user.save();
      }
      
      const userResponse = user.toObject();
      delete userResponse.passwordHash;
      delete userResponse._id;
      delete userResponse.__v;
      
      return res.json({
        token: 'jwt-token-' + Date.now(),
        user: userResponse
      });
    } catch (e) {
      return res.status(500).json({ error: 'Google auth mock failed' });
    }
  }
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    if (!email) {
      return res.status(400).json({ error: 'Email not provided by Google' });
    }
    
    const normalizedEmail = email.toLowerCase();
    
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      user = new User({
        id: uuidv4(),
        name: name || 'Google User',
        email: normalizedEmail,
        googleId: googleId,
        picture: picture
      });
      await user.save();
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && user.picture !== picture) {
        user.picture = picture;
        updated = true;
      }
      if ((!user.name || user.name === 'User') && name) {
        user.name = name;
        updated = true;
      }
      if (updated) await user.save();
    }
    
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    delete userResponse._id;
    delete userResponse.__v;
    
    res.json({
      token: 'jwt-token-' + Date.now(),
      user: userResponse
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Brand endpoints
app.get('/brands', async (req, res) => {
  try {
    const stores = await Store.find({}, 'Brand');
    const brands = [...new Set(stores.map(s => s.Brand))].filter(Boolean).map(brand => ({
      id: brand.toLowerCase().replace(/\s+/g, '-'),
      name: brand
    }));
    res.json(brands);
  } catch (err) {
    console.error('[/brands error]', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch brands', detail: err.message });
  }
});

app.get('/brands/:brandId/stores', async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const brandName = brandId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    // Handle both cases
    const stores = await Store.find({
      $or: [
        { Brand: brandName },
        // Fallback or exact match logic:
        // Actually, just fetching all and filtering is safer if we want the exact lower/replace logic, 
        // but let's try regex for case insensitive
        { Brand: { $regex: new RegExp(`^${brandName}$`, 'i') } }
      ]
    });
    
    // In case Regex doesn't perfectly match original logic:
    if(stores.length === 0) {
      const allStores = await Store.find({});
      const matched = allStores.filter(s => s.Brand && s.Brand.toLowerCase().replace(/\s+/g, '-') === brandId);
      return res.json(matched.map(s => {
        const obj = s.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
      }));
    }

    res.json(stores.map(s => {
        const obj = s.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brand stores' });
  }
});

// Store endpoints
app.get('/api/all-stores', async (req, res) => {
  try {
    const stores = await Store.find({});
    res.json(stores.map(s => {
        const obj = s.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

app.get('/stores/:storeId/products', async (req, res) => {
  try {
    const { storeId } = req.params;
    const products = await Product.find({ Store_ID: storeId });
    res.json(products.map(p => {
        const obj = p.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/home/quick-picks', async (req, res) => {
  try {
    const orders = await Order.find({});
    const products = await Product.find({});
    const stores = await Store.find({});
    
    const itemSales = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        itemSales[item.id] = (itemSales[item.id] || 0) + (item.quantity || 1);
      });
    });

    const quickPicks = products
      .filter(p => itemSales[p.Item_ID] > 0)
      .sort((a, b) => (itemSales[b.Item_ID] || 0) - (itemSales[a.Item_ID] || 0))
      .slice(0, 8)
      .map(p => {
        const store = stores.find(s => s.Store_ID === p.Store_ID);
        return {
          id: p.Item_ID,
          name: p.Item_Name,
          price: p.Price ? `₹${p.Price}` : 'Price unlisted',
          storeId: p.Store_ID,
          storeName: store ? store.Name : 'Local Store',
          image: p.Image_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
        };
      });

    res.json(quickPicks);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/home/trending', async (req, res) => {
  try {
    const stores = await Store.find({});
    const trending = stores
      .slice()
      .sort(() => 0.5 - Math.random()) // mock trending logic
      .slice(0, 8)
      .map(s => ({
        Store_ID: s.Store_ID,
        Name: s.Name,
        Brand: s.Brand,
        address: s.address,
        location: s.location
      }));
    res.json(trending);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/home/cravings', async (req, res) => {
  try {
    const products = await Product.find({});
    const dishesMap = {};
    products.forEach(product => {
      if (!product.Item_Name) return;
      const itemName = product.Item_Name.trim();
      if (!dishesMap[itemName]) {
        dishesMap[itemName] = {
          id: product.Item_ID || `temp-${Math.random()}`,
          name: itemName,
          stores: new Set(),
          image: product.Image_URL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400'
        };
      }
      if (product.Store_ID) {
        dishesMap[itemName].stores.add(product.Store_ID);
      }
      if (product.Image_URL && product.Image_URL.startsWith('http')) {
        dishesMap[itemName].image = product.Image_URL;
      }
    });

    const cravings = Object.values(dishesMap)
      .map(dish => ({
        id: dish.id,
        name: dish.name,
        image: dish.image,
        storesCount: dish.stores.size,
        stores: Array.from(dish.stores)
      }))
      .sort((a, b) => b.storesCount - a.storesCount)
      .slice(0, 8);

    res.json(cravings);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Product endpoints
app.post('/api/products/bulk-stock', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid ids array" });
    }

    const products = await Product.find({ Item_ID: { $in: ids } });
    
    const results = products.map(p => ({
      id: p.Item_ID,
      stock: p.Stock_Available
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/products/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const product = await Product.findOne({ Item_ID: itemId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const obj = product.toObject();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Product image endpoint
app.get('/api/product-image', (req, res) => {
  const { productName, category } = req.query;
  
  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  const hash = productName.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const encodedQuery = encodeURIComponent(productName.trim());
  const keywords = category 
    ? `${encodedQuery},${encodeURIComponent(category)},product,food,grocery`
    : `${encodedQuery},product,food,grocery`;
  
  const imageUrl = `https://source.unsplash.com/featured/400x400/?${keywords}&sig=${Math.abs(hash) % 10000}`;
  
  res.json({ imageUrl });
});

// Order endpoints
app.post('/orders', async (req, res) => {
  try {
    const { items, type, address, userId, store_id } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let calculatedTotal = 0;
    const processedItems = [];

    // Pre-fetch all products
    const itemIds = items.map(i => i.id);
    const products = await Product.find({ Item_ID: { $in: itemIds } });

    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: 'Item quantity must be greater than 0' });
      }

      const product = products.find(p => p.Item_ID === item.id);
      if (!product) {
        return res.status(400).json({ error: `Invalid product ID` });
      }

      if (product.Stock_Available < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.Item_Name}. Available: ${product.Stock_Available}, Requested: ${item.quantity}` 
        });
      }

      calculatedTotal += product.Price * item.quantity;

      processedItems.push({
        id: item.id,
        name: product.Item_Name,
        price: product.Price,
        quantity: item.quantity
      });
    }

    // Reduce inventory counts
    for (const item of processedItems) {
      await Product.updateOne(
        { Item_ID: item.id }, 
        { $inc: { Stock_Available: -item.quantity } }
      );
    }

    const orderId = 'ORD' + Date.now();
    const pickupToken = type === 'pickup' ? uuidv4() : null;
    
    const newOrder = new Order({
      orderId,
      userId: userId || 'user1',
      store_id: store_id || null, 
      items: processedItems,
      type,
      address: address || null,
      status: 'pending',
      pickupToken,
      total: calculatedTotal
    });
    
    await newOrder.save();

    // Emit real-time event to all connected seller dashboards
    const orderPayload = newOrder.toObject();
    delete orderPayload._id;
    delete orderPayload.__v;
    console.log('[socket] Emitting newOrder:', orderPayload.orderId);
    io.emit('newOrder', orderPayload);
    
    res.json({
      orderId,
      status: 'pending',
      pickupToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const obj = order.toObject();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const orders = await Order.find(query);
    res.json(orders.map(o => {
        const obj = o.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
    }));
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Mock dev endpoint to simulate QR scan
app.post('/mock/orders/:orderId/simulate-scan', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body;
    
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (action === 'ready') {
      order.status = 'ready';
    } else if (action === 'collected') {
      order.status = 'collected';
    } else {
      if (order.status === 'pending') {
        order.status = 'ready';
      } else if (order.status === 'ready') {
        order.status = 'collected';
      }
    }
    
    await order.save();
    
    const obj = order.toObject();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!transporter) {
      return res.status(503).json({ 
        error: 'Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file' 
      });
    }

    const mailOptions = {
      from: `Syncora <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c2185b;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #c2185b; margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This email was sent from the Syncora contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// -----------------------------------------------------------------------------
// SELLER PORTAL ENDPOINTS
// -----------------------------------------------------------------------------

// Seller Registration
app.post('/seller/register', async (req, res) => {
  try {
    const { name, email, password, storeName, brandName, address, lat, lng } = req.body;
    
    if (!name || !email || !password || !storeName || !brandName) {
      return res.status(400).json({ error: 'Missing required fields for seller registration' });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const existingSeller = await Seller.findOne({ email: normalizedEmail });
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller with this email already exists' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const storeId = 'STR' + Date.now();
    const newStore = new Store({
      Store_ID: storeId,
      Name: storeName,
      Brand: brandName,
      address: address || 'No address provided',
      location: {
        lat: lat || 23.2599,
        lng: lng || 77.4126
      }
    });
    await newStore.save();

    const newSeller = new Seller({
      id: uuidv4(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      storeId
    });
    await newSeller.save();
    
    const sellerResponse = newSeller.toObject();
    delete sellerResponse.passwordHash;
    delete sellerResponse._id;
    delete sellerResponse.__v;
    
    const storeResponse = newStore.toObject();
    delete storeResponse._id;
    delete storeResponse.__v;

    const token = jwt.sign(
      { sellerId: newSeller.id },
      process.env.JWT_SECRET || 'syncora-fallback-secret-key-1234',
      { expiresIn: '7d' }
    );
    res.json({ token, seller: sellerResponse, store: storeResponse });
  } catch (error) {
    console.error('Seller Registration error:', error);
    res.status(500).json({ error: 'Failed to register seller account' });
  }
});

// Seller Login
app.post('/seller/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const normalizedEmail = email.trim().toLowerCase();
    const seller = await Seller.findOne({ email: normalizedEmail });
    
    if (!seller) return res.status(401).json({ error: 'Invalid email or password' });
    
    const isPasswordValid = await bcrypt.compare(password, seller.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });
    
    const sellerResponse = seller.toObject();
    delete sellerResponse.passwordHash;
    delete sellerResponse._id;
    delete sellerResponse.__v;
    
    const store = await Store.findOne({ Store_ID: seller.storeId });
    const storeResponse = store ? store.toObject() : null;
    if (storeResponse) { delete storeResponse._id; delete storeResponse.__v; }
    
    const token = jwt.sign(
      { sellerId: seller.id },
      process.env.JWT_SECRET || 'syncora-fallback-secret-key-1234',
      { expiresIn: '7d' }
    );
    res.json({ token, seller: sellerResponse, store: storeResponse });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware for JWT seller authentication
const authenticateSeller = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'syncora-fallback-secret-key-1234');
    const seller = await Seller.findOne({ id: decoded.sellerId });
    
    if (!seller) {
      return res.status(401).json({ error: 'Unauthorized: Invalid seller ID' });
    }
    
    req.sellerId = decoded.sellerId;
    req.seller = seller;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Seller Session Check
app.get('/seller/me', authenticateSeller, async (req, res) => {
  try {
    const sellerData = req.seller.toObject();
    delete sellerData.passwordHash;
    delete sellerData._id;
    delete sellerData.__v;
    
    const store = await Store.findOne({ Store_ID: sellerData.storeId });
    const storeResponse = store ? store.toObject() : null;
    if (storeResponse) { delete storeResponse._id; delete storeResponse.__v; }
    
    res.json({ seller: sellerData, store: storeResponse });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Seller Products
app.get('/seller/products', authenticateSeller, async (req, res) => {
  try {
    const storeId = req.query.store_id || req.seller.storeId;
    const sellerProducts = await Product.find({ Store_ID: storeId });
    res.json(sellerProducts.map(p => {
        const obj = p.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/seller/products', authenticateSeller, async (req, res) => {
  try {
    const { Item_Name, Price, Stock_Available, Category, Sub_Category, Unit_Size, Image_URL, Description } = req.body;
    if (!Item_Name || !Price) return res.status(400).json({ error: 'Product name and price required' });
    
    const newProduct = new Product({
      Item_ID: 'ITEM' + Date.now(),
      Item_Name,
      Store_ID: req.seller.storeId,
      Price: Number(Price),
      Stock_Available: Number(Stock_Available) || 0,
      Category: Category || 'Uncategorized',
      Sub_Category: Sub_Category || '',
      Unit_Size: Unit_Size || '1 unit',
      Image_URL: Image_URL || '',
      Description: Description || ''
    });
    await newProduct.save();
    
    const obj = newProduct.toObject();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/seller/products/:itemId', authenticateSeller, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const product = await Product.findOne({ Item_ID: itemId, Store_ID: req.seller.storeId });
    if (!product) return res.status(404).json({ error: 'Product not found or unauthorized' });
    
    Object.assign(product, req.body);
    product.Item_ID = itemId; // Ensure ID doesn't change
    product.Store_ID = req.seller.storeId; // Ensure store ID doesn't change
    
    await product.save();
    
    const obj = product.toObject();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch(err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/seller/products/:itemId', authenticateSeller, async (req, res) => {
  try {
    const { itemId } = req.params;
    const deleted = await Product.findOneAndDelete({ Item_ID: itemId, Store_ID: req.seller.storeId });
    
    if (!deleted) return res.status(404).json({ error: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted successfully' });
  } catch(err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Seller Orders
app.get('/seller/orders', authenticateSeller, async (req, res) => {
  try {
    const storeId = req.query.store_id || req.seller.storeId;
    const storeProducts = await Product.find({ Store_ID: storeId });
    const storeProductIds = storeProducts.map(p => p.Item_ID);
    
    const allOrders = await Order.find({});
    
    const sellerOrders = allOrders.map(order => {
      const o = order.toObject();
      const storeItems = o.items.filter(item => storeProductIds.includes(item.id));
      if (storeItems.length > 0) {
        delete o._id;
        delete o.__v;
        return { ...o, items: storeItems, total: storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) };
      }
      return null;
    }).filter(Boolean);
    
    res.json(sellerOrders);
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.put('/seller/orders/:orderId/status', authenticateSeller, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const storeId = req.query.store_id || req.seller.storeId;
    
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const storeProducts = await Product.find({ Store_ID: storeId });
    const storeProductIds = storeProducts.map(p => p.Item_ID);
    
    const hasStoreItems = order.items.some(item => storeProductIds.includes(item.id));
    
    if (!hasStoreItems) return res.status(403).json({ error: 'Unauthorized to update this order' });
    
    order.status = status;
    await order.save();
    
    const obj = order.toObject();
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Seller Dashboard Stats
app.get('/seller/dashboard', authenticateSeller, async (req, res) => {
  try {
    const storeId = req.query.store_id || req.seller.storeId;
    
    const storeProducts = await Product.find({ Store_ID: storeId });
    const storeProductIds = storeProducts.map(p => p.Item_ID);
    
    const allOrders = await Order.find({});
    
    const sellerOrders = allOrders.filter(order => order.items.some(item => storeProductIds.includes(item.id)));
    
    const totalOrders = sellerOrders.length;
    const totalRevenue = sellerOrders.reduce((sum, order) => {
      const storeItems = order.items.filter(item => storeProductIds.includes(item.id));
      return sum + storeItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);
    
    const pendingOrders = sellerOrders.filter(o => o.status === 'pending').length;
    
    const lowStockProducts = storeProducts.filter(p => p.Stock_Available < 10 && p.Stock_Available > 0).length;
    const outOfStockProducts = storeProducts.filter(p => p.Stock_Available === 0).length;
    
    // Get recent 5 orders mapped
    const mappedRecentOrders = sellerOrders.slice(-5).reverse().map(order => {
      const o = order.toObject();
      const storeItems = o.items.filter(item => storeProductIds.includes(item.id));
      delete o._id;
      delete o.__v;
      return { ...o, items: storeItems, total: storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) };
    });

    res.json({
      revenue: totalRevenue,
      ordersCount: totalOrders,
      pendingOrders,
      totalProducts: storeProducts.length,
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts,
      recentOrders: mappedRecentOrders
    });
  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});
// -----------------------------------------------------------------------------

// Health check
app.get('/health', async (req, res) => {
  try {
    const storeCount = await Store.countDocuments();
    const productCount = await Product.countDocuments();
    res.json({ status: 'ok', stores: storeCount, products: productCount, mongooseState: mongoose.connection.readyState });
  } catch(err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});



// Handle server errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
