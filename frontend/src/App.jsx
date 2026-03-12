import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import VerticalSelection from './pages/VerticalSelection'
import FoodHome from './pages/FoodHome'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderStatus from './pages/OrderStatus'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'

// Seller Imports
import ProtectedSellerRoute from './components/auth/ProtectedSellerRoute'
import SellerLayout from './components/seller/SellerLayout'
import SellerRegister from './pages/seller/SellerRegister'
import SellerLogout from './pages/seller/SellerLogout'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import SellerInventory from './pages/seller/SellerInventory'
import SellerOrders from './pages/seller/SellerOrders'
import SellerPromotions from './pages/seller/SellerPromotions'
import SellerProfile from './pages/seller/SellerProfile'

function App() {
  return (
    <Router>
      <Routes>
        {/* Consumer Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-vertical" element={<VerticalSelection />} />
          <Route path="/food" element={<ErrorBoundary><FoodHome /></ErrorBoundary>} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/product/:itemId" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderStatus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Public Seller Routes */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route path="login" element={<Navigate to="/login" replace />} />
          <Route path="register" element={<SellerRegister />} />
          <Route path="logout" element={<SellerLogout />} />
        </Route>

        {/* Protected Seller Dashboard Routes */}
        <Route path="/seller" element={<ProtectedSellerRoute><SellerLayout /></ProtectedSellerRoute>}>
          <Route index element={<SellerDashboard />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          {/* Missing routes will be added shortly */}
          <Route path="products" element={<SellerProducts />} />
          <Route path="inventory" element={<SellerInventory />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="promotions" element={<SellerPromotions />} />
          <Route path="profile" element={<SellerProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

