import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(email, password)
    setLoading(false)
    
    if (result.success) {
      navigate('/select-vertical')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dark-pink/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-dark-pink/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-dark-pink/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/gradient-black-rose-gold-background_52683-148171.jpg?semt=ais_hybrid&w=740&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-near-black/80 via-gray-900/70 to-near-black/80"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-near-black/90 border-2 border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-dark-pink bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-text-secondary">Sign in to continue your journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-secondary mb-2 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-text-secondary mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark-pink text-white px-4 py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden shadow-lg shadow-dark-pink/30"
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

            <div className="text-center pt-4">
              <p className="text-text-secondary text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-dark-pink hover:underline font-semibold">
                  Create one now
                </Link>
              </p>
            </div>

            <Link
              to="/"
              className="block w-full text-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition text-text-secondary mt-4"
            >
              Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

