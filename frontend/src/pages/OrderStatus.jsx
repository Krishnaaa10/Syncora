import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api from '../api/axios'
import Toast from '../components/Toast'

const OrderStatus = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadOrder()
    const interval = setInterval(loadOrder, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [orderId])

  const loadOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`)
      setOrder(data)
    } catch (error) {
      setToast({ message: 'Failed to load order', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!order?.pickupToken) return

    const svg = document.querySelector('#qr-code svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `pickup-qr-${orderId}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    }

    img.onerror = () => {
      // Fallback: convert SVG to data URL and download
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pickup-qr-${orderId}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const simulateScan = async (action) => {
    try {
      await api.post(`/mock/orders/${orderId}/simulate-scan`, { action })
      await loadOrder()
      setToast({ message: `Order status updated to ${action}`, type: 'success' })
    } catch (error) {
      setToast({ message: 'Failed to simulate scan', type: 'error' })
    }
  }

  if (loading) {
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
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/85 via-gray-900/80 to-near-black/85"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,24,91,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(194,24,91,0.15),transparent_50%)]"></div>

        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <div className="text-text-secondary text-xl animate-fade-in-up">Loading order...</div>
        </div>
      </div>
    )
  }

  if (!order) {
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
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/85 via-gray-900/80 to-near-black/85"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,24,91,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(194,24,91,0.15),transparent_50%)]"></div>

        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <div className="text-text-secondary text-xl animate-fade-in-up">Order not found</div>
        </div>
      </div>
    )
  }

  const qrData = order.pickupToken
    ? JSON.stringify({ orderId: order.orderId, pickupToken: order.pickupToken })
    : null

  const statusColors = {
    pending: 'bg-yellow-600',
    ready: 'bg-blue-600',
    collected: 'bg-green-600',
    delivered: 'bg-green-600',
  }

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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 text-primary bg-gradient-to-r from-white via-text-secondary to-dark-pink bg-clip-text text-transparent">
            Order Status
          </h1>
          <p className="text-text-secondary text-lg">Track your order progress</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 mb-6 shadow-xl animate-fade-in-up transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20 hover:border-dark-pink/50">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-primary">Order #{order.orderId}</h2>
              <p className="text-text-secondary text-sm">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span className={`px-5 py-2.5 rounded-full text-white font-bold text-sm shadow-lg transform transition-all duration-300 hover:scale-105 ${statusColors[order.status] || 'bg-gray-600'}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          {order.address && (
            <div className="mb-6 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/30 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-semibold mb-2 text-primary">📍 Delivery Address</h3>
              <p className="text-text-secondary">{order.address}</p>
            </div>
          )}

          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-bold text-lg mb-4 text-primary">Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/30 transform transition-all duration-300 hover:scale-[1.02] hover:border-dark-pink/30"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <span className="text-text-secondary font-medium">{item.name} × {item.quantity}</span>
                  <span className="text-white font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-gray-700/50 pt-6 mt-6">
            <div className="flex justify-between items-center font-bold text-xl transform transition-all duration-300 hover:scale-105">
              <span className="text-primary">Total</span>
              <span className="text-dark-pink text-2xl bg-gradient-to-r from-dark-pink to-pink-500 bg-clip-text text-transparent">₹{order.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Pickup QR Code */}
        {order.type === 'pickup' && qrData && (
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 mb-6 shadow-xl animate-fade-in-up transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20 hover:border-dark-pink/50" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-6 text-primary">📱 Pickup QR Code</h2>
            <div className="flex flex-col items-center">
              <div 
                id="qr-code" 
                className="bg-white p-6 rounded-xl mb-6 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-dark-pink/20 border-4 border-gray-900/20"
              >
                <QRCodeSVG value={qrData} size={256} />
              </div>
              <button
                onClick={downloadQR}
                className="bg-dark-pink text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-dark-pink/50 active:scale-95 duration-300 text-lg shadow-lg shadow-dark-pink/30 mb-4"
              >
                Download QR Code
              </button>
              <p className="text-text-secondary text-sm text-center max-w-md leading-relaxed">
                Present this QR code at the store for pickup. The code contains your order ID and pickup token.
              </p>
            </div>
          </div>
        )}

        {/* Dev Tools - Simulate Scan */}
        {order.type === 'pickup' && (
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 shadow-xl animate-fade-in-up transform transition-all duration-300 hover:shadow-2xl hover:shadow-dark-pink/20 hover:border-dark-pink/50" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold mb-6 text-primary">🔧 Dev Tools (Simulate Scan)</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => simulateScan('ready')}
                disabled={order.status === 'collected'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 duration-300 shadow-lg"
              >
                Mark as Ready
              </button>
              <button
                onClick={() => simulateScan('collected')}
                disabled={order.status === 'collected'}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 duration-300 shadow-lg"
              >
                Mark as Collected
              </button>
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

export default OrderStatus

