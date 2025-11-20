import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import api from '../api/axios'

const ProfileDropdown = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const userId = user?.id || 'user1'
      const { data } = await api.get(`/orders?userId=${userId}`)
      setOrders(data || [])
    } catch (error) {
      console.error('Failed to load orders', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (isOpen) {
      loadOrders()
    }
  }, [isOpen, loadOrders])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const pendingOrders = orders.filter(o => ['pending', 'ready'].includes(o.status)).length
  const totalOrders = orders.length

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-pink to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-dark-pink/30 group-hover:shadow-dark-pink/50 transition-all duration-300 group-hover:scale-110">
            {getInitials(user?.name)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-near-black animate-pulse"></div>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-primary group-hover:text-dark-pink transition-colors">
            {user?.name || 'User'}
          </div>
          <div className="text-xs text-text-secondary">
            {user?.email?.split('@')[0] || 'Profile'}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 profile-dropdown">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-pink/20 to-pink-600/20 p-5 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dark-pink to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-dark-pink/50">
                  {getInitials(user?.name)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-primary truncate">{user?.name || 'User'}</h3>
                <p className="text-sm text-text-secondary truncate">{user?.email || 'No email'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-dark-pink/20 text-dark-pink rounded-full font-semibold">
                    Member
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 bg-gray-800/50 border-b border-gray-800">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-dark-pink border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 hover:border-dark-pink/50 transition-all duration-300 hover:scale-105 cursor-default">
                  <div className="text-2xl font-bold text-dark-pink">{totalOrders}</div>
                  <div className="text-xs text-text-secondary mt-1">Total Orders</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 cursor-default">
                  <div className="text-2xl font-bold text-yellow-500">{pendingOrders}</div>
                  <div className="text-xs text-text-secondary mt-1">Pending</div>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group menu-item"
            >
              <svg className="w-5 h-5 text-text-secondary group-hover:text-dark-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="flex-1 text-primary group-hover:text-dark-pink transition-colors font-medium">My Profile</span>
              <svg className="w-4 h-4 text-text-secondary group-hover:text-dark-pink transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group menu-item"
            >
              <svg className="w-5 h-5 text-text-secondary group-hover:text-dark-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="flex-1 text-primary group-hover:text-dark-pink transition-colors font-medium">Order History</span>
              {pendingOrders > 0 && (
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-bold animate-pulse">
                  {pendingOrders}
                </span>
              )}
              <svg className="w-4 h-4 text-text-secondary group-hover:text-dark-pink transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/select-vertical"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 group menu-item"
            >
              <svg className="w-5 h-5 text-text-secondary group-hover:text-dark-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="flex-1 text-primary group-hover:text-dark-pink transition-colors font-medium">Categories</span>
              <svg className="w-4 h-4 text-text-secondary group-hover:text-dark-pink transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <div className="h-px bg-gray-800 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 transition-all duration-300 group menu-item"
            >
              <svg className="w-5 h-5 text-text-secondary group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="flex-1 text-left text-primary group-hover:text-red-500 transition-colors font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown

