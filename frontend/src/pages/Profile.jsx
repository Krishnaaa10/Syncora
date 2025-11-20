import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../stores/authStore'

const Profile = () => {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const userId = user?.id || 'user1'
      const { data } = await api.get(`/orders?userId=${userId}`)
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Failed to load orders', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-600',
    ready: 'bg-blue-600',
    collected: 'bg-green-600',
    delivered: 'bg-green-600',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* User Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        {user ? (
          <div className="space-y-2">
            <div>
              <span className="text-text-secondary">Name:</span>
              <span className="ml-2 font-semibold">{user.name}</span>
            </div>
            <div>
              <span className="text-text-secondary">Email:</span>
              <span className="ml-2 font-semibold">{user.email}</span>
            </div>
            <div>
              <span className="text-text-secondary">User ID:</span>
              <span className="ml-2 font-semibold">{user.id}</span>
            </div>
          </div>
        ) : (
          <p className="text-text-secondary">Not logged in</p>
        )}
      </div>

      {/* Order History */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        {loading ? (
          <div className="text-text-secondary">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-text-secondary mb-4">No orders yet</p>
            <Link
              to="/food"
              className="text-dark-pink hover:opacity-80"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.orderId}
                to={`/orders/${order.orderId}`}
                className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold">Order #{order.orderId}</h3>
                    <p className="text-text-secondary text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-dark-pink">
                      ₹{order.total?.toFixed(2) || '0.00'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      statusColors[order.status] || 'bg-gray-600'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-text-secondary text-sm">
                  {order.type === 'pickup' ? '🔄 Pickup' : '🚚 Delivery'} • {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

