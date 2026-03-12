# 🚀 Syncora - Modern E-Commerce & Delivery Platform

![Syncora Banner](https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=2000&h=600)

**Syncora** is a comprehensive, full-stack e-commerce and fast-delivery platform. It features both a sleek **Consumer Application** for browsing and ordering, and a powerful, real-time **Seller Portal** for merchants to manage their incoming orders, inventory, and store settings. 

---

## ✨ Key Features

### 🍔 Consumer Application
- **Modern UI/UX:** Responsive, mobile-first design built with React and Tailwind CSS.
- **Smart Cart System:** Real-time stock validation, automated inventory checks, and bulk API optimizations to ensure item availability.
- **Interactive Checkout flow:** Integrated with Google Maps for location selection, supporting both "Delivery" and "Pickup" with QR code generation for in-store pickups.
- **Multi-Vertical Support:** Designed to scale across different verticals like Food, Furniture, and Restaurants.

### 🏪 Seller Portal (Dashboard)
- **Real-Time Order Management:** Powered by **Socket.IO**, sellers receive instant live notifications the moment a consumer places an order.
- **Secure Authentication:** JWT-based robust authentication system protecting sensitive merchant data and store settings.
- **Live Inventory Tracking:** Instantly reflect stock deductions across the platform when orders are placed.
- **Analytics & Status Controls:** Update order statuses (Pending, Ready, Collected, Delivered) instantly.

### ⚙️ Backend Architecture
- **MongoDB Integration:** Persistent, scalable data storage using Mongoose schemas.
- **Optimized Performance:** Solved N+1 query bottlenecks in cart validation via a centralized bulk stock-check endpoint.
- **Websockets:** Bi-directional real-time communication between the Node.js server and React dashboards.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Zustand
- **Routing:** React Router v6
- **Real-Time:** Socket.IO-Client
- **Maps:** Google Maps API integration

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Real-Time:** Socket.IO
- **Mailing:** Nodemailer (for Contact Form)

---

## 📂 Project Structure

```text
Syncora/
├── backend/                  # Node.js/Express Backend
│   ├── models/               # Mongoose schemas (User, Seller, Store, Product, Order)
│   ├── server.js             # Main entry point & API routes
│   ├── seed_mongo.js         # MongoDB seeding script
│   └── package.json    
└── frontend/                 # React/Vite Frontend
    ├── src/             
    │   ├── api/              # Axios instances & interceptors
    │   ├── components/       # Reusable UI components & Layouts
    │   ├── pages/            # Consumer & Seller pages
    │   ├── stores/           # Zustand state configurations
    │   └── App.jsx           # Master Routing
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v16.0 or higher
- **MongoDB:** A running local MongoDB instance or a MongoDB Atlas URI
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Krishnaaa10/Syncora.git
cd Syncora
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and setup environment variables.
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
# Optional for email services:
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and configure the environment.
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key  # Optional
```

Start the frontend development server:
```bash
npm run dev
```

---

## 📖 Usage Guide & Testing Flow

1. **Seed the Database:** When the backend server first connects to an empty MongoDB database, it will automatically run the seed functionality.
2. **Access the App:** Open `http://localhost:5173` in your browser.
3. **Consumer Flow:**
   - Log in using test credentials (or register a new user).
   - Navigate to the Food section (`/food`).
   - Add items to the cart, choose "Delivery" or "Pickup", and checkout.
4. **Seller Flow:**
   - Open a secondary browser tab or window.
   - Go to `http://localhost:5173/login`, click **"Are you a seller?"**.
   - Log in with the demo seller credentials:
     - Email: `seller@syncora.com`
     - Password: `seller123`
   - View real-time orders pop up dynamically on the **Seller Dashboard**.

---

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/Krishnaaa10/Syncora/issues) if you want to contribute.

## 📄 License
This project is for educational and portfolio purposes. 
