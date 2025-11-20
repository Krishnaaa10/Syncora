# Syncora Backend - Mock Server

Mock Express server for Syncora consumer website with seed data.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
# or
npm run mock
```

Server runs on `http://localhost:3001`

## API Endpoints

- `POST /auth/login` - Mock login (accepts any credentials)
- `GET /brands` - List all brands
- `GET /brands/:brandId/stores` - Get stores for a brand
- `GET /stores/:storeId/products` - Get products for a store
- `GET /products/:itemId` - Get product details
- `POST /orders` - Create order (returns orderId and pickupToken if type=pickup)
- `GET /orders/:orderId` - Get order details
- `GET /orders?userId=xxx` - Get user orders
- `POST /mock/orders/:orderId/simulate-scan` - Simulate QR scan (dev only)

## Seed Data

Seed data is loaded from `seed.json`. To replace with full dataset later, update the `seed.json` file and restart the server.

