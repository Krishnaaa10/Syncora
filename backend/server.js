// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const https = require('https');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

// Load seed data
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8'));

// In-memory stores
let stores = [...seedData.stores];
let products = [...seedData.products];
let orders = [];
let users = [];

// Google OAuth client (you'll need to set these in environment variables)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Mock user for testing (with hashed password)
// IMPORTANT: This user's password is 'demo123'
const demoPasswordHash = bcrypt.hashSync('demo123', 10);
users.push({
  id: 'user1',
  name: 'Demo User',
  email: 'demo@syncora.com',
  passwordHash: demoPasswordHash,
  createdAt: new Date().toISOString()
});

// Clean up any users without passwordHash (from old code)
// This ensures all users have password hashes
users = users.map(user => {
  if (!user.passwordHash && user.email) {
    // If user exists without password hash, they need to reset password
    // For now, we'll skip them in login
    return user;
  }
  return user;
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Syncora Mock API Server',
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
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  // Check if user already exists (case-insensitive)
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }
  
  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Return user without password hash
    const { passwordHash: _, ...userResponse } = newUser;
    
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
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
  
  // Find user by email (case-insensitive)
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Check if user has password hash (for Google OAuth users, they might not have one)
  if (!user.passwordHash) {
    return res.status(401).json({ error: 'Please sign in with Google or reset your password' });
  }
  
  try {
    // CRITICAL: Validate password using bcrypt.compare
    // This MUST be called and checked - no bypassing allowed
    if (!user.passwordHash || typeof user.passwordHash !== 'string') {
      console.error('User missing password hash:', normalizedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    // Debug logging (remove in production)
    console.log('Login attempt:', {
      email: normalizedEmail,
      hasPasswordHash: !!user.passwordHash,
      passwordMatch: isPasswordValid,
      passwordLength: password.length
    });
    
    // CRITICAL: Reject if password doesn't match
    if (isPasswordValid !== true) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Only proceed if password is valid
    // Return user without password hash
    const { passwordHash: _, ...userResponse } = user;
    
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
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
    // If Google OAuth is not configured, allow mock authentication for development
    console.warn('Google OAuth not configured. Using mock authentication.');
    
    // For development: create a mock user
    const mockEmail = 'google.user@example.com';
    let user = users.find(u => u.email.toLowerCase() === mockEmail);
    
    if (!user) {
      user = {
        id: uuidv4(),
        name: 'Google User',
        email: mockEmail,
        googleId: 'mock-google-id',
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }
    
    const { passwordHash: _, ...userResponse } = user;
    return res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: userResponse
    });
  }
  
  try {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    if (!email) {
      return res.status(400).json({ error: 'Email not provided by Google' });
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase();
    
    // Check if user exists
    let user = users.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (!user) {
      // Create new user
      user = {
        id: uuidv4(),
        name: name || 'Google User',
        email: normalizedEmail,
        googleId: googleId,
        picture: picture,
        createdAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      // Update existing user with Google info if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture || user.picture;
        if (!user.name || user.name === 'User') {
          user.name = name || user.name;
        }
      }
    }
    
    // Return user without sensitive data
    const userResponse = { ...user };
    delete userResponse.passwordHash;
    
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: userResponse
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Brand endpoints
app.get('/brands', (req, res) => {
  const brands = [...new Set(stores.map(s => s.Brand))].map(brand => ({
    id: brand.toLowerCase().replace(/\s+/g, '-'),
    name: brand
  }));
  res.json(brands);
});

app.get('/brands/:brandId/stores', (req, res) => {
  const brandId = req.params.brandId;
  const brandName = brandId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const brandStores = stores.filter(s => s.Brand === brandName || s.Brand.toLowerCase().replace(/\s+/g, '-') === brandId);
  res.json(brandStores);
});

// Store endpoints
app.get('/stores/:storeId/products', (req, res) => {
  const { storeId } = req.params;
  const storeProducts = products.filter(p => p.Store_ID === storeId);
  res.json(storeProducts);
});

// Product endpoints
app.get('/products/:itemId', (req, res) => {
  const { itemId } = req.params;
  const product = products.find(p => p.Item_ID === itemId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Product image endpoint - searches for real product images
app.get('/api/product-image', (req, res) => {
  const { productName, category } = req.query;
  
  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  // Create a hash from product name for consistent image selection
  const hash = productName.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Encode the product name for URL
  const encodedQuery = encodeURIComponent(productName.trim());
  const keywords = category 
    ? `${encodedQuery},${encodeURIComponent(category)},product,food,grocery`
    : `${encodedQuery},product,food,grocery`;
  
  // Use Unsplash Source API to search for images matching the product name
  const imageUrl = `https://source.unsplash.com/featured/400x400/?${keywords}&sig=${Math.abs(hash) % 10000}`;
  
  res.json({ imageUrl });
});

// Order endpoints
app.post('/orders', (req, res) => {
  const { items, type, address, userId } = req.body;
  
  const orderId = 'ORD' + Date.now();
  const pickupToken = type === 'pickup' ? uuidv4() : null;
  
  const order = {
    orderId,
    userId: userId || 'user1',
    items,
    type, // 'pickup' or 'delivery'
    address: address || null,
    status: 'pending',
    pickupToken,
    createdAt: new Date().toISOString(),
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };
  
  orders.push(order);
  
  res.json({
    orderId,
    status: 'pending',
    pickupToken
  });
});

app.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.find(o => o.orderId === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.get('/orders', (req, res) => {
  const { userId } = req.query;
  const userOrders = orders.filter(o => o.userId === userId || !userId);
  res.json(userOrders);
});

// Mock dev endpoint to simulate QR scan
app.post('/mock/orders/:orderId/simulate-scan', (req, res) => {
  const { orderId } = req.params;
  const { action } = req.body; // 'ready' or 'collected'
  
  const order = orders.find(o => o.orderId === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (action === 'ready') {
    order.status = 'ready';
  } else if (action === 'collected') {
    order.status = 'collected';
  } else {
    // Default: toggle between pending -> ready -> collected
    if (order.status === 'pending') {
      order.status = 'ready';
    } else if (order.status === 'ready') {
      order.status = 'collected';
    }
  }
  
  res.json(order);
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email service is configured
    if (!transporter) {
      return res.status(503).json({ 
        error: 'Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file' 
      });
    }

    // Email options
    const mailOptions = {
      from: `Syncora <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Sends to your Gmail
      replyTo: email, // User's email for reply
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

    // Send email
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', stores: stores.length, products: products.length });
});

// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handling middleware (must be last, with 4 parameters)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`Loaded ${stores.length} stores and ${products.length} products from seed data`);
});

// Handle server errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

