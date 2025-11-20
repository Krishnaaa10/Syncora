import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import api from '../api/axios'
import Toast from '../components/Toast'

const Cart = () => {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [toast, setToast] = useState(null)
  const [stockWarnings, setStockWarnings] = useState({})

  useEffect(() => {
    checkStock()
  }, [items])

  const checkStock = async () => {
    const warnings = {}
    for (const item of items) {
      try {
        const { data: product } = await api.get(`/products/${item.id}`)
        if (product.Stock_Available < item.quantity) {
          warnings[item.id] = {
            available: product.Stock_Available,
            requested: item.quantity,
          }
        }
      } catch (error) {
        console.error('Failed to check stock for', item.id)
      }
    }
    setStockWarnings(warnings)
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    const result = await updateQuantity(itemId, newQuantity)
    if (!result.success) {
      setToast({ message: result.error || 'Failed to update quantity', type: 'error' })
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      setToast({ message: 'Cart is empty', type: 'error' })
      return
    }
    navigate('/checkout')
  }

  const handlePickup = async () => {
    if (items.length === 0) {
      setToast({ message: 'Cart is empty', type: 'error' })
      return
    }

    try {
      const userId = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')).id 
        : 'user1'

      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const { data } = await api.post('/orders', {
        items: orderItems,
        type: 'pickup',
        userId,
      })

      clearCart()
      navigate(`/orders/${data.orderId}`)
    } catch (error) {
      setToast({ message: 'Failed to create pickup order', type: 'error' })
    }
  }

  const subtotal = getTotal()
  const deliveryFee = 50 // Mock
  const discount = promoCode === 'SAVE10' ? subtotal * 0.1 : 0
  const total = subtotal + deliveryFee - discount

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://cdn.shopify.com/s/files/1/0070/7032/articles/ecommerce-checkout-flow.png?v=1729518007')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
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
            Shopping Cart
          </h1>
          <p className="text-text-secondary text-lg">Review your items and proceed to checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up-delay">
            <div className="text-8xl mb-6 animate-float">🛒</div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Your cart is empty</h2>
            <p className="text-text-secondary mb-8 text-lg max-w-md mx-auto">
              Start adding items to your cart to see them here
            </p>
            <button
              onClick={() => navigate('/food')}
              className="bg-dark-pink text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-dark-pink/50 transform duration-300 text-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item, index) => {
                  const warning = stockWarnings[item.id]
                  return (
                    <div
                      key={item.id}
                      className="cart-item bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-5 shadow-xl animate-fade-in-up transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-dark-pink/20 hover:border-dark-pink/50 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {warning && (
                        <div className="mb-3 p-3 bg-red-900/40 backdrop-blur-sm border border-red-700/50 rounded-lg text-sm animate-shake">
                          ⚠️ Stock update: Only {warning.available} units available (you have {warning.requested} in cart)
                        </div>
                      )}
                      <div className="flex gap-5">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl flex items-center justify-center flex-shrink-0 transform transition-all duration-300 hover:scale-110 hover:rotate-6 cart-item-image border border-gray-700/50 shadow-lg group-hover:shadow-dark-pink/30">
                          <span className="text-4xl">📦</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-xl mb-2 text-primary group-hover:text-dark-pink transition-colors">{item.name}</h3>
                            <p className="text-text-secondary text-sm mb-3">
                              Store: {item.storeId} • {item.unitSize}
                            </p>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="text-2xl font-bold text-dark-pink transform transition-all duration-300 hover:scale-105 bg-gradient-to-r from-dark-pink to-pink-500 bg-clip-text text-transparent">
                              ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="cart-btn-minus w-9 h-9 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-600/70 hover:border-dark-pink/50 transform transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center text-lg font-bold text-white"
                                >
                                  −
                                </button>
                                <span className="w-12 text-center font-bold cart-quantity text-white text-lg">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stockAvailable}
                                  className="cart-btn-plus w-9 h-9 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-600/70 hover:border-dark-pink/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 flex items-center justify-center text-lg font-bold text-white"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="cart-btn-remove px-4 py-2 text-red-400 hover:text-red-300 text-sm transform transition-all duration-200 hover:scale-110 active:scale-95 font-semibold bg-red-900/20 hover:bg-red-900/30 rounded-lg border border-red-800/30 hover:border-red-700/50 backdrop-blur-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="cart-summary bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 sticky top-24 shadow-xl animate-slide-in-right transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20">
                <h2 className="text-2xl font-bold mb-6 text-primary">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-text-secondary transform transition-all duration-300 hover:translate-x-1 py-2 border-b border-gray-800/50">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary transform transition-all duration-300 hover:translate-x-1 py-2 border-b border-gray-800/50">
                    <span className="font-medium">Delivery</span>
                    <span className="font-semibold text-white">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400 transform transition-all duration-300 hover:translate-x-1 animate-scale-in py-2 border-b border-gray-800/50">
                      <span className="font-medium">Discount</span>
                      <span className="font-semibold text-green-400">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-700/50 pt-3 mt-2">
                    <div className="flex justify-between font-bold text-xl transform transition-all duration-300 hover:scale-105">
                      <span className="text-primary">Total</span>
                      <span className="text-dark-pink text-2xl bg-gradient-to-r from-dark-pink to-pink-500 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-text-secondary text-sm mb-2 font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="SAVE10"
                      className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transform transition-all duration-300 focus:scale-[1.02] placeholder:text-gray-500"
                    />
                    <button
                      onClick={() => {
                        if (promoCode === 'SAVE10') {
                          setToast({ message: 'Promo code applied!', type: 'success' })
                        } else {
                          setToast({ message: 'Invalid promo code', type: 'error' })
                        }
                      }}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-5 py-3 hover:bg-gray-700/70 hover:border-dark-pink/50 transition-all transform hover:scale-105 active:scale-95 duration-200 font-medium text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="cart-checkout-btn w-full bg-dark-pink text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-dark-pink/50 active:scale-95 duration-300 text-lg shadow-lg shadow-dark-pink/30"
                  >
                    Proceed to Delivery Checkout
                  </button>
                  <button
                    onClick={handlePickup}
                    className="cart-pickup-btn w-full bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 text-white py-4 rounded-lg font-semibold hover:bg-gray-700/70 hover:border-dark-pink/50 transition-all transform hover:scale-105 hover:shadow-2xl active:scale-95 duration-300 text-lg"
                  >
                    Order for Pickup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

export default Cart

