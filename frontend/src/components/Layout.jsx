import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useCartStore from '../stores/cartStore'
import Logo from './Logo'
import ProfileDropdown from './ProfileDropdown'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { items } = useCartStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isLandingPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-near-black text-primary">
      <nav className="bg-near-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Link 
                  to="/select-vertical" 
                  className="text-text-secondary hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-800/50 font-medium"
                >
                  Categories
                </Link>
                <ProfileDropdown />
              </>
            )}
            
            <Link 
              to="/about" 
              className="text-text-secondary hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-800/50 font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-text-secondary hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-800/50 font-medium"
            >
              Contact
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative group p-2 rounded-lg hover:bg-gray-800/50 transition"
              >
                <svg className="w-6 h-6 text-text-secondary group-hover:text-primary transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-dark-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {!isAuthenticated && (
              <>
                {isLandingPage && (
                  <Link
                    to="/register"
                    className="text-dark-pink hover:text-pink-400 transition px-4 py-2 rounded-lg hover:bg-gray-800/50 font-medium border border-dark-pink/30 hover:border-dark-pink hover:scale-105 transform"
                  >
                    Register Now
                  </Link>
                )}
                <Link
                  to="/login"
                  className="bg-dark-pink text-white px-4 py-2 rounded-lg hover:opacity-90 transition transform hover:scale-105 font-semibold shadow-lg shadow-dark-pink/30"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout

