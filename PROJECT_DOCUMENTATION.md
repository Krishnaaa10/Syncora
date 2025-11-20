# Syncora Project - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Frontend Documentation](#frontend-documentation)
3. [Backend Documentation](#backend-documentation)
4. [Project Architecture](#project-architecture)
5. [Development Guide](#development-guide)

---

# Project Overview

Syncora is a full-stack e-commerce platform for the Food vertical, providing consumers with a seamless shopping experience across multiple brands and stores. The platform features interactive store mapping, real-time inventory management, cart functionality, and order tracking with QR code support for pickup orders.

**Key Features:**
- Multi-brand store selection with interactive maps
- Real-time stock validation
- Shopping cart with persistent storage
- Order management (Delivery & Pickup)
- QR code generation for pickup orders
- User authentication with Google OAuth support
- Responsive design for all devices

---

# Frontend Documentation

## Technology Stack

### Core Framework
- **React 18.2.0** - Modern UI library with hooks and components
- **Vite 5.0.8** - Fast build tool and dev server with HMR
- **React Router DOM 6.20.0** - Client-side routing and navigation

### State Management
- **Zustand 4.4.7** - Lightweight, performant state management

### UI & Styling
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **PostCSS 8.4.32** - CSS processing and optimization
- **Autoprefixer 10.4.16** - Automatic vendor prefixing

### Libraries & Integrations
- **Axios 1.6.2** - HTTP client for API requests
- **React Leaflet 5.0.0** - React wrapper for Leaflet maps
- **Leaflet 1.9.4** - Interactive map library
- **Three.js 0.160.0** - 3D graphics library
- **@react-three/fiber 8.15.0** - React renderer for Three.js
- **@react-three/drei 9.88.0** - Useful helpers for React Three Fiber
- **qrcode.react 3.1.0** - QR code generation component
- **@react-oauth/google 0.12.2** - Google OAuth integration (installed, partially implemented)

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with interceptors
│   ├── components/
│   │   ├── Layout.jsx            # Main layout with navigation
│   │   ├── Logo.jsx              # Syncora logo component
│   │   ├── ProfileDropdown.jsx   # User profile dropdown
│   │   ├── LoginModal.jsx        # Login modal (used on landing)
│   │   ├── RegisterModal.jsx     # Registration modal
│   │   ├── StoreMap.jsx          # Interactive store map
│   │   ├── Syncora3D.jsx         # 3D animated text component
│   │   └── Toast.jsx             # Toast notification component
│   ├── pages/
│   │   ├── Landing.jsx           # Landing/home page
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── VerticalSelection.jsx # Category selection (Food/Furniture/Restaurant)
│   │   ├── FoodHome.jsx          # Food vertical - brand/store selection
│   │   ├── StorePage.jsx         # Store products listing
│   │   ├── ProductPage.jsx       # Individual product details
│   │   ├── Cart.jsx              # Shopping cart
│   │   ├── Checkout.jsx          # Checkout (delivery flow)
│   │   ├── OrderStatus.jsx       # Order status & QR code
│   │   ├── Profile.jsx           # User profile & order history
│   │   ├── About.jsx             # About page
│   │   └── Contact.jsx           # Contact page
│   ├── stores/
│   │   ├── authStore.js          # Authentication state (Zustand)
│   │   ├── cartStore.js          # Shopping cart state (Zustand)
│   │   └── storeStore.js         # Selected store state (Zustand)
│   ├── mocks/
│   │   └── seed.json             # Mock data (same as backend)
│   ├── App.jsx                   # Main app component with routes
│   ├── main.jsx                  # React app entry point
│   └── index.css                 # Global styles
├── dist/                         # Production build output
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── postcss.config.js             # PostCSS configuration
```

## Routing Structure

The application uses React Router v6 for client-side navigation. All routes are defined in `App.jsx`:

```javascript
/                           → Landing Page (Public)
/login                      → Login Page (Public)
/register                   → Registration Page (Public)
/select-vertical            → Vertical Selection (Protected)
/food                       → Food Home - Brand Selection (Protected)
/store/:storeId             → Store Products Page (Protected)
/product/:itemId            → Product Details Page (Protected)
/cart                       → Shopping Cart (Protected)
/checkout                   → Checkout Page (Protected)
/orders/:orderId            → Order Status Page (Protected)
/profile                    → User Profile (Protected)
/about                      → About Page (Public)
/contact                    → Contact Page (Public)
```

### Complete User Flow

1. **Landing** (`/`)
   - User sees project description
   - Login/Register modals available
   - Links to vertical selection

2. **Authentication** (`/login` or `/register`)
   - Email/password registration
   - Email/password login
   - Google OAuth (backend ready, frontend partial)
   - Redirects to `/select-vertical` on success

3. **Vertical Selection** (`/select-vertical`)
   - Choose category: Food, Furniture, or Restaurant
   - Currently only Food is fully implemented
   - Redirects to `/food` for Food vertical

4. **Food Home** (`/food`)
   - **Brand Selection View**: Animated accordion cards for each brand
   - **Store Selection View**:
     - Left: Interactive map with store markers
     - Right: Store list with details
     - Geolocation detection
     - Distance-based sorting
     - Nearest store highlighting

5. **Store Page** (`/store/:storeId`)
   - Product grid display
   - Category/Sub-category filters
   - Stock badges
   - Add to cart functionality
   - Click product → Navigate to product page

6. **Product Page** (`/product/:itemId`)
   - Product details
   - Quantity selector
   - Stock information
   - Add to cart

7. **Cart** (`/cart`)
   - Cart items list
   - Quantity controls
   - Stock validation
   - Promo code input (mock: "SAVE10")
   - Two checkout options:
     - **Delivery** → `/checkout`
     - **Pickup** → Create order → `/orders/:orderId`

8. **Checkout** (`/checkout`)
   - Delivery address form
   - Mock payment processing
   - Order creation
   - Redirect to order status

9. **Order Status** (`/orders/:orderId`)
   - Order details display
   - Status tracking (pending → ready → collected/delivered)
   - QR code for pickup orders
   - QR download (PNG)
   - Status polling (every 5 seconds)
   - Dev tools for simulating QR scan

10. **Profile** (`/profile`)
    - User information
    - Order history
    - Account management

## State Management (Zustand Stores)

### 1. Auth Store (`stores/authStore.js`)

**Purpose:** Manages user authentication state

**State:**
```javascript
{
  user: null | UserObject,
  token: null | string,
  isAuthenticated: boolean
}
```

**Actions:**
- `register(name, email, password)` - Register new user
  - Calls POST /auth/register
  - Stores token and user in localStorage
  - Updates state
  
- `login(email, password)` - Login user
  - Calls POST /auth/login
  - Stores token and user in localStorage
  - Updates state
  
- `logout()` - Clear authentication
  - Removes token and user from localStorage
  - Resets state
  
- `initialize()` - Load auth from localStorage
  - Called on app mount
  - Restores session if token exists

**Persistence:** Token and user stored in localStorage

### 2. Cart Store (`stores/cartStore.js`)

**Purpose:** Manages shopping cart state

**State:**
```javascript
{
  items: Array<{
    id: string,
    name: string,
    price: number,
    quantity: number,
    storeId: string,
    unitSize: string,
    stockAvailable: number
  }>
}
```

**Actions:**
- `addItem(product, quantity)` - Add/update cart item
  - Fetches current stock from API
  - Validates stock availability
  - Updates existing item or adds new
  - Saves to localStorage
  
- `removeItem(itemId)` - Remove item from cart
  - Filters out item
  - Updates localStorage
  
- `updateQuantity(itemId, quantity)` - Update item quantity
  - Fetches current stock
  - Validates against available stock
  - Updates quantity
  - Saves to localStorage
  
- `clearCart()` - Empty cart
  - Clears items array
  - Removes from localStorage
  
- `getTotal()` - Calculate cart total
  - Returns sum of (price * quantity) for all items

**Features:**
- Real-time stock validation on add/update
- Stock warnings for unavailable quantities
- Persistent storage in localStorage

### 3. Store Store (`stores/storeStore.js`)

**Purpose:** Manages selected store state

**State:**
```javascript
{
  selectedStore: null | StoreObject
}
```

**Actions:**
- `setSelectedStore(store)` - Set selected store
  - Stores in localStorage
  - Updates state
  
- `clearSelectedStore()` - Clear selection
  - Removes from localStorage
  - Resets state

**Persistence:** Selected store stored in localStorage

## API Integration

### Axios Configuration (`api/axios.js`)

**Setup:**
```javascript
baseURL: process.env.VITE_API_URL || 'http://localhost:3001'
Content-Type: application/json
```

**Request Interceptor:**
- Automatically adds `Authorization: Bearer {token}` header
- Token retrieved from localStorage

**Usage Example:**
```javascript
import api from '../api/axios'

// GET request
const { data } = await api.get('/brands')

// POST request
const response = await api.post('/auth/login', {
  email, password
})
```

## Component Architecture

### Layout Component (`components/Layout.jsx`)

**Features:**
- Wraps all pages
- Navigation bar (sticky)
- Logo with link to home
- Cart icon with item count badge
- Profile dropdown (when authenticated)
- Links: Categories, About, Contact
- Login/Register buttons (when not authenticated)

### Key Page Components

#### Landing Page (`pages/Landing.jsx`)
- Hero section with 3D "Syncora" text (Three.js)
- Project description
- Login/Register modals
- Vertical selection cards
- Animated background effects

#### Food Home (`pages/FoodHome.jsx`)
**Features:**
- **Brand View**: Vertical accordion cards
  - Hover to expand
  - Brand images
  - Smooth animations
  
- **Store View**: Split layout
  - **Left (50%)**: Interactive map
    - Store markers
    - User location marker
    - Click marker → Scroll to store in list
    - Hover effect highlights store
  
  - **Right (50%)**: Store list
    - Store cards with details
    - Location detection button
    - Nearest store button
    - Distance calculation (Haversine formula)
    - Sort by distance
    - Hover to highlight on map

**Geolocation:**
- Uses browser Geolocation API
- Calculates distance to stores
- Sorts stores by proximity
- Highlights nearest store

#### Store Page (`pages/StorePage.jsx`)
**Features:**
- Product grid layout
- Filter by Category (dropdown)
- Filter by Sub-Category (dropdown)
- Product cards with:
  - Product image (from Unsplash if not in seed data)
  - Name, price, stock
  - Stock badge (color-coded)
  - Add to cart button
- Click product → Navigate to product details

#### Cart Page (`pages/Cart.jsx`)
**Features:**
- Cart items list
- Quantity controls (+/- buttons)
- Remove item button
- Stock validation on quantity change
- Stock warnings (if stock changed after adding)
- Promo code input (mock: "SAVE10" = 10% discount)
- Order summary:
  - Subtotal
  - Delivery fee (mock: ₹50)
  - Discount
  - Total
- Two CTA buttons:
  - **Order for Delivery** → `/checkout`
  - **Order for Pickup** → Create order → `/orders/:orderId`

#### Order Status Page (`pages/OrderStatus.jsx`)
**Features:**
- Order details display
- Status badge (pending/ready/collected/delivered)
- Items list with quantities
- Total amount
- **For Pickup Orders:**
  - QR code display
  - Download QR button (PNG)
  - Pickup token display
- Status polling (updates every 5 seconds)
- **Dev Tools** (for testing):
  - "Mark as Ready" button
  - "Mark as Collected" button
  - Simulates QR scan by store staff

## Styling & Theme

### Color Palette (Tailwind Config)

```javascript
colors: {
  'near-black': '#0b0b0b',      // Background
  'dark-pink': '#c2185b',       // Primary accent/CTA
  'text-primary': '#ffffff',    // Primary text
  'text-secondary': '#bdbdbd'   // Secondary text
}
```

### Design Patterns
- **Dark Theme**: Near-black backgrounds throughout
- **Gradient Overlays**: Multiple gradient layers for depth
- **Animated Backgrounds**: Floating particles, blobs, wave patterns
- **Smooth Transitions**: Hover effects, page transitions
- **Responsive Design**: Mobile-first approach
- **Custom Scrollbars**: Styled scrollbars for better UX
- **Toast Notifications**: Non-intrusive feedback messages

### Responsive Breakpoints
- Mobile: Default (< 768px)
- Tablet: md: (≥ 768px)
- Desktop: lg: (≥ 1024px)

## Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here (optional)
```

## Development Scripts

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
```

## Build Process

1. **Development:**
   - Vite dev server with HMR (Hot Module Replacement)
   - Fast refresh on file changes
   - Source maps for debugging

2. **Production:**
   - Vite builds optimized bundle
   - Code splitting (route-based)
   - CSS minification
   - Asset optimization
   - Output to `dist/` directory

---

# Backend Documentation

## Technology Stack

### Core Framework
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **CORS 2.8.5** - Cross-origin resource sharing middleware

### Security & Authentication
- **bcrypt 5.1.1** - Password hashing
- **google-auth-library 9.15.1** - Google OAuth token verification
- **@react-oauth/google 0.12.2** - Google OAuth dependency

### Utilities
- **uuid 9.0.1** - Unique ID generation for orders and users
- **fs** (built-in) - File system for reading seed data
- **path** (built-in) - Path utilities for file operations

### Development Tools
- **nodemon 3.0.2** - Auto-restart server on file changes

## Project Structure

```
backend/
├── server.js                        # Main Express server file
├── seed.json                        # Seed data (stores, products)
├── mega_all_brands_with_addresses.json  # Extended brand/store data
├── package.json                     # Dependencies and scripts
└── README.md                        # Backend-specific docs
```

## Server Architecture

### Initialization Flow

1. **Express App Setup**
   ```javascript
   app.use(cors())              // Enable CORS for frontend
   app.use(express.json())      // Parse JSON request bodies
   ```

2. **Data Loading**
   - Reads `seed.json` on server start
   - Populates in-memory arrays:
     - `stores` - Store data
     - `products` - Product data
   - Creates demo user:
     - Email: `demo@syncora.com`
     - Password: `demo123`
     - Pre-hashed with bcrypt

3. **OAuth Configuration**
   - Checks for `GOOGLE_CLIENT_ID` environment variable
   - Creates OAuth2Client if configured
   - Falls back to mock authentication if not set

4. **Route Registration**
   - Root and health endpoints
   - Authentication routes (`/auth/*`)
   - Brand and store routes (`/brands/*`)
   - Product routes (`/products/*`, `/stores/*/products`)
   - Order routes (`/orders/*`)
   - Mock dev routes (`/mock/*`)

5. **Error Handling**
   - 404 handler for unknown routes
   - Error middleware for exceptions
   - Proper HTTP status codes

## API Endpoints

### Root Endpoint

**GET /**
- **Purpose:** Server information and available endpoints
- **Response:**
  ```json
  {
    "message": "Syncora Mock API Server",
    "version": "1.0.0",
    "endpoints": {
      "health": "/health",
      "login": "POST /auth/login",
      "brands": "GET /brands",
      "stores": "GET /brands/:brandId/stores",
      "products": "GET /stores/:storeId/products",
      "product": "GET /products/:itemId",
      "orders": "POST /orders, GET /orders/:orderId"
    }
  }
  ```

### Health Check

**GET /health**
- **Purpose:** Server health status
- **Response:**
  ```json
  {
    "status": "ok",
    "stores": 5,
    "products": 30
  }
  ```

### Authentication Endpoints

#### 1. Register User

**POST /auth/register**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- ✅ Name, email, password required
- ✅ Email format validation (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- ✅ Password minimum 6 characters
- ✅ Email uniqueness check (case-insensitive)

**Process:**
1. Validate input
2. Normalize email to lowercase
3. Check if user already exists
4. Hash password with bcrypt (10 salt rounds)
5. Create user object with UUID
6. Store in users array
7. Return token and user (without password hash)

**Response (200):**
```json
{
  "token": "mock-jwt-token-1704067200000",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing fields or invalid email format
- `400` - User already exists
- `500` - Server error during registration

#### 2. Login User

**POST /auth/login**

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- ✅ Email and password required
- ✅ Case-insensitive email lookup
- ✅ Password verification with bcrypt.compare()
- ✅ Rejects if user doesn't have password (Google OAuth users)

**Process:**
1. Validate input
2. Normalize email to lowercase
3. Find user by email
4. Verify password with bcrypt.compare()
5. Return token and user (without password hash)

**Response (200):**
```json
{
  "token": "mock-jwt-token-1704067200000",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password
- `401` - User exists but no password (Google OAuth user)

#### 3. Google OAuth

**POST /auth/google**

**Request Body:**
```json
{
  "credential": "google-id-token-here"
}
```

**Flow:**

**Development Mode (No GOOGLE_CLIENT_ID):**
1. Creates/returns mock Google user
2. Email: `google.user@example.com`
3. Name: "Google User"

**Production Mode (GOOGLE_CLIENT_ID set):**
1. Verifies Google ID token with OAuth2Client
2. Extracts payload: email, name, picture, googleId (sub)
3. Normalizes email to lowercase
4. Checks if user exists by email
5. If new user: Creates account with Google data
6. If existing user: Updates with Google info (links accounts)
7. Returns token and user data

**Response (200):**
```json
{
  "token": "mock-jwt-token-1704067200000",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "googleId": "google-user-id",
    "picture": "https://profile-pic-url",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing credential
- `400` - Email not provided by Google
- `401` - Invalid Google token

### Brand & Store Endpoints

#### 1. Get All Brands

**GET /brands**

**Purpose:** List all available brands

**Process:**
1. Extract unique brand names from stores array
2. Convert to lowercase with hyphens for IDs
3. Return brand list

**Response (200):**
```json
[
  {
    "id": "manohar-dairy",
    "name": "Manohar Dairy"
  },
  {
    "id": "bake-n-shake",
    "name": "Bake N Shake"
  }
]
```

#### 2. Get Stores by Brand

**GET /brands/:brandId/stores**

**Example:** `/brands/manohar-dairy/stores`

**Process:**
1. Convert brandId (hyphens) to brand name (spaces, capitalized)
2. Filter stores by brand name (case-insensitive)
3. Return stores array

**Response (200):**
```json
[
  {
    "Store_ID": "MNR01",
    "Name": "Manohar - Main Outlet",
    "Brand": "Manohar Dairy",
    "address": "123 Main Street, City, State 12345",
    "location": {
      "lat": 23.2599,
      "lng": 77.4126
    }
  }
]
```

### Product Endpoints

#### 1. Get Products by Store

**GET /stores/:storeId/products**

**Example:** `/stores/MNR01/products`

**Process:**
1. Filter products by Store_ID
2. Return products array

**Response (200):**
```json
[
  {
    "Item_ID": "ITEM001",
    "Item_Name": "Akhrot Bites",
    "Store_ID": "MNR01",
    "Price": 150,
    "Stock_Available": 50,
    "Category": "Snacks",
    "Sub_Category": "Dry Fruits",
    "Unit_Size": "250g",
    "Image_URL": "https://example.com/image.jpg"
  }
]
```

#### 2. Get Product Details

**GET /products/:itemId**

**Example:** `/products/ITEM001`

**Process:**
1. Find product by Item_ID
2. Return product object

**Response (200):**
```json
{
  "Item_ID": "ITEM001",
  "Item_Name": "Akhrot Bites",
  "Store_ID": "MNR01",
  "Price": 150,
  "Stock_Available": 50,
  "Category": "Snacks",
  "Sub_Category": "Dry Fruits",
  "Unit_Size": "250g",
  "Description": "Delicious walnut bites"
}
```

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

#### 3. Get Product Image (Unsplash Proxy)

**GET /api/product-image?productName=...&category=...**

**Purpose:** Generate product image URL from Unsplash

**Query Parameters:**
- `productName` (required) - Product name for search
- `category` (optional) - Category for better search results

**Process:**
1. Create hash from product name for consistent image
2. Encode product name and category for URL
3. Construct Unsplash Source API URL
4. Return image URL

**Response (200):**
```json
{
  "imageUrl": "https://source.unsplash.com/featured/400x400/?akhrot-bites,product,food,grocery&sig=1234"
}
```

### Order Endpoints

#### 1. Create Order

**POST /orders**

**Request Body:**
```json
{
  "items": [
    {
      "id": "ITEM001",
      "name": "Akhrot Bites",
      "price": 150,
      "quantity": 2
    }
  ],
  "type": "pickup",  // or "delivery"
  "address": "123 Main St, City",  // required for delivery
  "userId": "user-uuid"
}
```

**Process:**
1. Generate unique order ID: `ORD + timestamp`
2. Generate pickup token (UUID) if type is "pickup"
3. Calculate total from items
4. Create order object
5. Store in orders array
6. Return orderId and pickupToken

**Response (200):**
```json
{
  "orderId": "ORD1704067200000",
  "status": "pending",
  "pickupToken": "550e8400-e29b-41d4-a716-446655440000"  // only for pickup
}
```

#### 2. Get Order Details

**GET /orders/:orderId**

**Example:** `/orders/ORD1704067200000`

**Process:**
1. Find order by orderId
2. Return order object

**Response (200):**
```json
{
  "orderId": "ORD1704067200000",
  "userId": "user-uuid",
  "items": [
    {
      "id": "ITEM001",
      "name": "Akhrot Bites",
      "price": 150,
      "quantity": 2
    }
  ],
  "type": "pickup",
  "status": "pending",  // pending → ready → collected/delivered
  "address": null,
  "pickupToken": "550e8400-e29b-41d4-a716-446655440000",
  "total": 300,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Order not found"
}
```

#### 3. Get User Orders

**GET /orders?userId=user-uuid**

**Query Parameters:**
- `userId` (optional) - Filter orders by user

**Process:**
1. If userId provided: Filter orders by userId
2. If no userId: Return all orders
3. Return orders array

**Response (200):**
```json
[
  { /* order 1 */ },
  { /* order 2 */ }
]
```

### Development/Testing Endpoints

#### Simulate QR Scan

**POST /mock/orders/:orderId/simulate-scan**

**Purpose:** Simulate store staff scanning QR code to update order status

**Request Body:**
```json
{
  "action": "ready"  // or "collected"
}
```

**Process:**
1. Find order by orderId
2. Update status based on action:
   - `"ready"` → status = "ready"
   - `"collected"` → status = "collected"
   - Default → Toggle status (pending → ready → collected)
3. Return updated order

**Response (200):**
```json
{
  "orderId": "ORD1704067200000",
  "status": "ready",
  // ... rest of order data
}
```

**Error Response (404):**
```json
{
  "error": "Order not found"
}
```

## Data Models

### User Model

```javascript
{
  id: String,              // UUID
  name: String,            // User's full name
  email: String,           // Lowercase, unique
  passwordHash: String,    // bcrypt hash (10 rounds)
  googleId: String,        // Optional, for OAuth users
  picture: String,         // Optional, profile picture URL
  createdAt: String        // ISO date string
}
```

### Store Model

```javascript
{
  Store_ID: String,        // Unique store identifier (e.g., "MNR01")
  Name: String,            // Store name
  Brand: String,           // Brand name
  address: String,         // Full address
  location: {
    lat: Number,           // Latitude
    lng: Number            // Longitude
  }
}
```

### Product Model

```javascript
{
  Item_ID: String,         // Unique product identifier
  Item_Name: String,       // Product name
  Store_ID: String,        // Associated store ID
  Price: Number,           // Price in currency units
  Stock_Available: Number, // Available quantity
  Category: String,        // Product category
  Sub_Category: String,    // Product subcategory
  Unit_Size: String,       // Unit size (e.g., "250g")
  Image_URL: String,       // Optional, product image URL
  Description: String      // Optional, product description
}
```

### Order Model

```javascript
{
  orderId: String,         // Format: "ORD" + timestamp
  userId: String,          // User UUID
  items: Array<{
    id: String,            // Product Item_ID
    name: String,          // Product name
    price: Number,         // Price per unit
    quantity: Number       // Quantity ordered
  }>,
  type: String,            // "pickup" or "delivery"
  status: String,          // "pending" | "ready" | "collected" | "delivered"
  address: String | null,  // Delivery address (null for pickup)
  pickupToken: String | null, // UUID for pickup QR (null for delivery)
  total: Number,           // Total order amount
  createdAt: String        // ISO date string
}
```

## Security Features

### 1. Password Security
- ✅ All passwords hashed with bcrypt (10 salt rounds)
- ✅ Passwords never stored in plain text
- ✅ Passwords never returned in API responses
- ✅ Password minimum length validation (6 characters)

### 2. Email Security
- ✅ Email normalization (lowercase) prevents duplicate accounts
- ✅ Case-insensitive email lookup for login
- ✅ Email format validation (regex pattern)

### 3. Authentication
- ✅ Token-based authentication (mock JWT tokens)
- ✅ Bearer token support via Authorization header
- ✅ Google OAuth token verification (when configured)

### 4. Error Handling
- ✅ User-friendly error messages
- ✅ No sensitive information leaked in errors
- ✅ Proper HTTP status codes:
  - `200` - Success
  - `400` - Bad Request (validation errors)
  - `401` - Unauthorized (authentication failures)
  - `404` - Not Found
  - `500` - Internal Server Error

## In-Memory Storage

**Note:** This is a mock server using in-memory storage. All data resets on server restart.

### Storage Arrays

- `users` - Registered users array
  - Initialized with demo user
  - Grows as users register
  
- `stores` - Store data array
  - Loaded from `seed.json` on server start
  - Static (read-only during runtime)
  
- `products` - Product data array
  - Loaded from `seed.json` on server start
  - Static (read-only during runtime)
  
- `orders` - Orders array
  - Empty on server start
  - Grows as orders are created

### Demo User

Pre-loaded on server start:
- **Email:** `demo@syncora.com`
- **Password:** `demo123`
- **Password Hash:** Pre-computed with bcrypt (10 rounds)

## Environment Variables

Create `backend/.env`:
```env
PORT=3001
GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Note:** If `GOOGLE_CLIENT_ID` is not set, the server uses mock Google authentication for development.

## Development Scripts

```bash
npm start     # Start server (node server.js)
npm run dev   # Start with nodemon (auto-restart on file changes)
npm run mock  # Alias for npm start
```

## CORS Configuration

Currently configured for development:
```javascript
app.use(cors())  // Allows all origins
```

**For Production:** Should restrict to frontend domain:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}))
```

---

# Project Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React App  │  │ localStorage │  │   Zustand    │     │
│  │  (Frontend)  │◄─┤   Storage    │◄─┤    Stores    │     │
│  └──────┬───────┘  └──────────────┘  └──────────────┘     │
└─────────┼───────────────────────────────────────────────────┘
          │
          │ HTTP/REST API
          │ (Port 5173 → 3001)
          │
┌─────────▼───────────────────────────────────────────────────┐
│                    Express Server                           │
│                     (Backend)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │   Auth       │  │   In-Memory  │     │
│  │   Handler    │◄─┤   Logic      │◄─┤   Storage    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   bcrypt     │  │   Google     │                        │
│  │   Hashing    │  │   OAuth      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
User Input → Frontend (Login Form)
    ↓
POST /auth/login
    ↓
Backend (Validate Credentials)
    ↓
Hash Comparison (bcrypt.compare)
    ↓
Generate Token + User Data
    ↓
Response to Frontend
    ↓
Store in localStorage + Zustand Store
    ↓
Update UI (Authenticated State)
```

### Shopping Flow

```
User Selects Brand → Frontend
    ↓
GET /brands/:brandId/stores
    ↓
Backend (Filter Stores)
    ↓
Return Stores Array
    ↓
Frontend (Display on Map + List)
    ↓
User Selects Store → Frontend
    ↓
GET /stores/:storeId/products
    ↓
Backend (Filter Products)
    ↓
Return Products Array
    ↓
Frontend (Display Product Grid)
    ↓
User Adds to Cart → Frontend
    ↓
GET /products/:itemId (Stock Check)
    ↓
Backend (Return Product Data)
    ↓
Frontend (Validate Stock + Add to Cart)
    ↓
Store in Cart Store + localStorage
```

### Order Flow

```
User Checks Out → Frontend
    ↓
POST /orders
    ↓
Backend (Create Order)
    ↓
Generate Order ID + Pickup Token
    ↓
Return Order Data
    ↓
Frontend (Navigate to Order Status)
    ↓
GET /orders/:orderId (Polling every 5s)
    ↓
Backend (Return Order Status)
    ↓
Frontend (Update UI with Status)
```

### QR Code Scan Flow (Pickup)

```
User Views QR Code → Frontend
    ↓
Store Staff Scans QR Code
    ↓
POST /mock/orders/:orderId/simulate-scan
    ↓
Backend (Update Order Status)
    ↓
Status: pending → ready
    ↓
Frontend Polls Status
    ↓
Status Updated in UI
    ↓
Status: ready → collected
```

## Technology Choices Rationale

### Frontend Choices

**React 18**
- Industry standard
- Component-based architecture
- Large ecosystem
- Excellent developer experience

**Vite**
- Lightning-fast dev server
- Modern build tool
- HMR (Hot Module Replacement)
- Optimized production builds

**Zustand**
- Lightweight (< 1KB)
- Simple API
- No boilerplate (unlike Redux)
- Perfect for this project's needs

**Tailwind CSS**
- Rapid UI development
- Utility-first approach
- Responsive design built-in
- Customizable theme

**React Router v6**
- Standard for React routing
- Declarative routes
- Nested routes support
- Protected route patterns

### Backend Choices

**Express.js**
- Minimalist framework
- Flexible middleware system
- Large community
- Perfect for REST APIs

**bcrypt**
- Industry standard for password hashing
- Secure by default
- Slow by design (prevents brute force)

**In-Memory Storage**
- Simple for MVP
- No database setup required
- Easy to replace with real DB later
- Perfect for demo/testing

**CORS**
- Required for frontend-backend communication
- Simple configuration
- Secure defaults

## Development Workflow

### Local Development Setup

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   # Server runs on http://localhost:3001
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Server runs on http://localhost:5173
   ```

3. **Access Application:**
   - Open browser: `http://localhost:5173`
   - Frontend automatically connects to backend at `http://localhost:3001`

### Hot Reload

- **Frontend:** Vite HMR updates instantly on file save
- **Backend:** Nodemon restarts server on file save

### Testing Flow

1. Register/Login with demo account
2. Navigate to Food vertical
3. Select brand → View stores
4. Select store → Browse products
5. Add items to cart
6. Checkout (Delivery or Pickup)
7. View order status
8. (For Pickup) Test QR scan simulation

---

# Development Guide

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git (optional, for version control)

### Setup Steps

1. **Clone/Navigate to Project**
   ```bash
   cd C:\GYM_MAIN\Syncora
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Optional: Create .env file with PORT and GOOGLE_CLIENT_ID
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Optional: Create .env file with VITE_API_URL and VITE_GOOGLE_CLIENT_ID
   npm run dev
   ```

4. **Access Application**
   - Open: `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
PORT=3001
GOOGLE_CLIENT_ID=your-google-client-id-here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Common Issues & Solutions

### Backend Issues

**Port 3001 already in use:**
- Change PORT in `.env`
- Or kill process using port 3001

**Module not found errors:**
- Run `npm install` in backend directory
- Check `package.json` for missing dependencies

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically try next port
- Or change port in `vite.config.js`

**API connection errors:**
- Ensure backend is running
- Check `VITE_API_URL` in `.env`
- Check CORS configuration in backend

**Module not found errors:**
- Run `npm install` in frontend directory
- Check `package.json` for missing dependencies

### 3D Text Not Loading

- Check browser console for errors
- Ensure internet connection (font loads from CDN)
- Three.js packages should be installed

## Deployment Considerations

### Frontend Deployment

**Build Command:**
```bash
npm run build
```

**Output:** `dist/` directory (static files)

**Deployment Options:**
- **Vercel** - Automatic deployments from Git
- **Netlify** - Static site hosting
- **AWS S3 + CloudFront** - Scalable CDN
- **GitHub Pages** - Free hosting

**Environment Variables:**
- Set `VITE_API_URL` to production backend URL
- Set `VITE_GOOGLE_CLIENT_ID` for OAuth

### Backend Deployment

**Requirements:**
- Node.js runtime
- Environment variables

**Deployment Options:**
- **Heroku** - Easy Node.js hosting
- **Railway** - Modern deployment platform
- **AWS EC2** - Full control
- **DigitalOcean** - VPS hosting
- **Render** - Free tier available

**Environment Variables:**
- `PORT` - Production port (usually provided by platform)
- `GOOGLE_CLIENT_ID` - For OAuth
- Database connection strings (when DB added)

**Important Notes:**
- Update CORS origin to production frontend URL
- Set up environment variables on hosting platform
- Consider adding database for production
- Enable HTTPS for security

## Future Enhancements

### Planned Features

1. **Database Integration**
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Persistent data across server restarts
   - Better scalability

2. **Real Payment Processing**
   - Integrate Stripe or Razorpay
   - Secure payment gateway
   - Payment status tracking

3. **Real-Time Updates**
   - WebSocket support (Socket.IO)
   - Live order status updates
   - Push notifications

4. **Email Service**
   - Order confirmation emails
   - Password reset emails
   - Marketing emails

5. **Advanced Features**
   - Product search and filtering
   - User reviews and ratings
   - Wishlist functionality
   - Product recommendations
   - Admin dashboard
   - Inventory management

6. **Security Enhancements**
   - Real JWT token generation and verification
   - Rate limiting
   - API throttling
   - Input sanitization
   - XSS protection

7. **Performance Optimizations**
   - Image optimization and CDN
   - Code splitting
   - Lazy loading
   - Caching strategies

8. **Testing**
   - Unit tests (Jest)
   - Integration tests (Supertest)
   - E2E tests (Cypress/Playwright)
   - Component tests (React Testing Library)

## Support & Resources

### Documentation References

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [React Router Documentation](https://reactrouter.com/)

### Demo Account

- **Email:** `demo@syncora.com`
- **Password:** `demo123`

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready (MVP)
