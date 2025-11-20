import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(email, password)
    setLoading(false)
    
    if (result.success) {
      onClose()
      navigate('/select-vertical')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in relative overflow-hidden"
      onClick={onClose}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-dark-pink opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 15}s`,
            }}
          ></div>
        ))}
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-dark-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div 
        className="bg-near-black border-2 border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-dark-pink bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-text-secondary">Sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-text-secondary mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm animate-shake">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-pink text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose()
                  if (onSwitchToRegister) onSwitchToRegister()
                }}
                className="text-dark-pink hover:underline font-semibold"
              >
                Register now
              </button>
            </p>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition text-text-secondary"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
