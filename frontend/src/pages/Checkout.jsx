import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import api from '../api/axios'
import Toast from '../components/Toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (items.length === 0) {
      setToast({ message: 'Cart is empty', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const userId = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).id
        : 'user1'

      const orderItems = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
      }))

      const { data } = await api.post('/orders', {
        items: orderItems,
        type: 'delivery',
        address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
        userId,
      })

      clearCart()
      navigate(`/orders/${data.orderId}`)
    } catch (error) {
      setToast({ message: 'Failed to place order', type: 'error' })
      setLoading(false)
    }
  }

  const subtotal = getTotal()
  const deliveryFee = 50
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://cdn-icons-png.flaticon.com/512/8354/8354634.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: 0.15,
        }}
      ></div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-near-black/85 via-gray-900/80 to-near-black/85"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,24,91,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(194,24,91,0.15),transparent_50%)]"></div>
      
      {/* Animated mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(194, 24, 91, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(194, 24, 91, 0.08) 0%, transparent 70%)
          `,
          backgroundSize: '200% 200%',
          animation: 'mesh-gradient 20s ease infinite'
        }}
      />
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-dark-pink opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
            }}
          ></div>
        ))}
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-dark-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', transform: 'translate(-50%, -50%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 text-primary bg-gradient-to-r from-white via-text-secondary to-dark-pink bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-text-secondary text-lg">Complete your order with delivery details</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 shadow-xl animate-fade-in-up transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20 hover:border-dark-pink/50">
              <h2 className="text-2xl font-bold mb-6 text-primary">Delivery Address</h2>
              <div className="space-y-4">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-text-secondary text-sm mb-2 font-medium">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transform transition-all duration-300 focus:scale-[1.02] placeholder:text-gray-500"
                    placeholder="Enter your street address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <label className="block text-text-secondary text-sm mb-2 font-medium">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transform transition-all duration-300 focus:scale-[1.02] placeholder:text-gray-500"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <label className="block text-text-secondary text-sm mb-2 font-medium">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transform transition-all duration-300 focus:scale-[1.02] placeholder:text-gray-500"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <label className="block text-text-secondary text-sm mb-2 font-medium">ZIP Code</label>
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transform transition-all duration-300 focus:scale-[1.02] placeholder:text-gray-500"
                      placeholder="ZIP Code"
                      required
                    />
                  </div>
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <label className="block text-text-secondary text-sm mb-2 font-medium">Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transform transition-all duration-300 focus:scale-[1.02] placeholder:text-gray-500"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 shadow-xl animate-fade-in-up transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20 hover:border-dark-pink/50" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold mb-6 text-primary">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:border-dark-pink/50 hover:bg-gray-800/50 group">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-dark-pink focus:ring-dark-pink focus:ring-2"
                  />
                  <span className="font-medium text-primary group-hover:text-dark-pink transition-colors">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-4 p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:border-dark-pink/50 hover:bg-gray-800/50 group">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-dark-pink focus:ring-dark-pink focus:ring-2"
                  />
                  <span className="font-medium text-primary group-hover:text-dark-pink transition-colors">UPI</span>
                </label>
                <label className="flex items-center gap-4 p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:border-dark-pink/50 hover:bg-gray-800/50 group">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-dark-pink focus:ring-dark-pink focus:ring-2"
                  />
                  <span className="font-medium text-primary group-hover:text-dark-pink transition-colors">Cash on Delivery</span>
                </label>
              </div>
              <div className="mt-6 p-4 bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 rounded-lg text-sm text-blue-300">
                💡 This is a mock checkout. No actual payment will be processed.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 sticky top-24 shadow-xl animate-slide-in-right transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20">
              <h2 className="text-2xl font-bold mb-6 text-primary">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="text-text-secondary text-sm py-2 border-b border-gray-800/50">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </div>
                <div className="flex justify-between text-text-secondary transform transition-all duration-300 hover:translate-x-1 py-2 border-b border-gray-800/50">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary transform transition-all duration-300 hover:translate-x-1 py-2 border-b border-gray-800/50">
                  <span className="font-medium">Delivery</span>
                  <span className="font-semibold text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-700/50 pt-3 mt-2">
                  <div className="flex justify-between font-bold text-xl transform transition-all duration-300 hover:scale-105">
                    <span className="text-primary">Total</span>
                    <span className="text-dark-pink text-2xl bg-gradient-to-r from-dark-pink to-pink-500 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark-pink text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-dark-pink/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 duration-300 text-lg shadow-lg shadow-dark-pink/30"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

export default Checkout

