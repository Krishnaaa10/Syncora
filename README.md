# Syncora - Consumer Website (Food Vertical)

A consumer-facing React website for Syncora's Food vertical, built with React (Vite), Tailwind CSS, and a mock Express backend.

## Project Structure

```
Syncora/
├── backend/          # Express mock server
│   ├── server.js    # Main server file
│   ├── seed.json    # Seed data (exactly as specified)
│   └── package.json
└── frontend/        # React frontend
    ├── src/
    │   ├── pages/   # All page components
    │   ├── components/
    │   ├── stores/  # Zustand state management
    │   └── api/     # Axios configuration
    └── package.json
```

## Theme Colors

- **Background**: `#0b0b0b` (near black)
- **Primary Accent/CTA**: `#c2185b` (darker pink)
- **Text Primary**: `#ffffff` (white)
- **Text Secondary**: `#bdbdbd` (light gray)

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- (Optional) Google Maps API key for map functionality

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The mock server will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and add your Google Maps API key (optional)
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

Create `frontend/.env` with:

```
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
```

If `VITE_GOOGLE_MAPS_KEY` is not provided, the app will use a static map placeholder.

## Seed Data

The app uses exactly the provided seed dataset:
- **1 Store**: Manohar - Main Outlet (MNR01)
- **6 Products**: Akhrot Bites, Badam Burfi, Besan Laddu, Kachori, Samosa, Namkeen Mix

Seed data is loaded from `backend/seed.json`. To replace with full dataset later, update this file and restart the server.

## Features

### Pages Implemented

1. **Landing (`/`)** - Project description, login modal, three vertical choice cards (Furniture, Restaurant, Food). Only Food works.

2. **Food Home (`/food`)** - Brand selector, Google Map (left), store list (right). Single store marker pulses as "nearest".

3. **Store Page (`/store/:storeId`)** - Product grid with filters by Category/Sub_Category, stock badges, add-to-cart.

4. **Product Detail (`/product/:itemId`)** - Product details, quantity selector, stock info, add to cart.

5. **Cart (`/cart`)** - Cart items with qty controls, stock validation, promo code input, two CTAs: Delivery and Pickup.

6. **Checkout (`/checkout`)** - Delivery flow: collect address, mock payment, create order.

7. **Order Status (`/orders/:orderId`)** - Order details, pickup QR code (for pickup orders), download QR button, status updates.

8. **Profile (`/profile`)** - User info and past orders list.

### Key Features

- **Stock Validation**: Prevents adding more items than available stock
- **Stock Warnings**: Shows warnings in cart if stock has changed
- **Pickup QR**: Generates and allows download of QR code for pickup orders
- **Responsive Design**: Mobile-first, map stacks above list on mobile
- **Persistent State**: Selected store and cart persisted in localStorage
- **Mock Authentication**: Accepts any credentials for demo purposes

## Demo Flow: Creating a Pickup Order & Simulating Scan

### Step 1: Login
1. Navigate to `/` and click "Get Started"
2. Use any email/password (e.g., `demo@syncora.com` / `password`)
3. Click Login

### Step 2: Browse Products
1. Click on the Food card to go to `/food`
2. Click "View Products" on the Manohar store
3. Browse products and add items to cart

### Step 3: Create Pickup Order
1. Go to `/cart`
2. Click "Order for Pickup"
3. You'll be redirected to the order status page with a QR code

### Step 4: Simulate QR Scan (Dev Tool)
1. On the order status page, scroll to "Dev Tools (Simulate Scan)"
2. Click "Mark as Ready" to change status from `pending` to `ready`
3. Click "Mark as Collected" to change status to `collected`
4. Order status updates automatically (polls every 5 seconds)

### Step 5: Download QR Code
1. Click "Download QR Code" button
2. QR code will be saved as PNG file: `pickup-qr-{orderId}.png`

## API Endpoints

### Backend (Mock Server)

- `POST /auth/login` - Mock login (accepts any credentials)
- `GET /brands` - List all brands (returns Manohar only)
- `GET /brands/:brandId/stores` - Get stores for a brand
- `GET /stores/:storeId/products` - Get products for a store
- `GET /products/:itemId` - Get product details
- `POST /orders` - Create order (returns orderId and pickupToken if type=pickup)
- `GET /orders/:orderId` - Get order details
- `GET /orders?userId=xxx` - Get user orders
- `POST /mock/orders/:orderId/simulate-scan` - Simulate QR scan (dev only, sets order to 'ready' or 'collected')

## Testing Checklist

- [x] App runs with `npm run dev` (frontend) and `npm run mock` (backend)
- [x] Landing page shows three cards; Food navigates to `/food`
- [x] On `/food`: Map left + store list right; MNR01 marker visible and pulsating
- [x] Store page lists six seed items with correct Price and Stock_Available
- [x] Add to cart enforces stock rules
- [x] Cart shows correct totals
- [x] Pickup flow returns QR and allows download
- [x] Simulate scan transitions order status
- [x] UI uses exact theme colors and is responsive

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Maps**: Google Maps JS API (with static fallback)
- **QR Code**: qrcode.react
- **Backend**: Express.js (mock server)

## Development Notes

- All product IDs are mapped from `Item_ID` to internal `product.id`
- Selected store is persisted in localStorage
- Cart is persisted in localStorage
- Stock validation happens on add-to-cart and quantity updates
- Mock server uses in-memory storage (resets on restart)
- TODO markers in code indicate where seller/inventory sync logic will be plugged later

## Future Enhancements

- Replace seed.json with full dataset
- Integrate real backend API
- Add seller/inventory sync logic
- Real-time order status updates via Socket.IO
- Image uploads for products
- Real payment integration
- Multi-store support with distance calculation

## License

This is a demo project for educational purposes.

