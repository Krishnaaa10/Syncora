import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useSellerAuthStore from '../stores/sellerAuthStore'

const Login = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('selection') // 'selection' or 'form'
  const [accountType, setAccountType] = useState('customer') // 'customer' or 'seller'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const loginCustomer = useAuthStore((state) => state.login)
  const loginSeller = useSellerAuthStore((state) => state.login)

  // Prevent vertical scrolling on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    let result
    if (accountType === 'seller') {
      result = await loginSeller(email, password)
    } else {
      result = await loginCustomer(email, password)
    }
    
    setLoading(false)
    
    if (result.success) {
      if (accountType === 'seller') {
        navigate('/seller/dashboard')
      } else {
        navigate('/select-vertical')
      }
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen lg:min-h-0 lg:h-[calc(100vh-76px)] lg:overflow-hidden bg-near-black text-primary flex">
      {/* Left Column: Form/Selection */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 py-12 relative z-10 bg-[#0a0a0a] min-h-screen lg:min-h-0 lg:h-full lg:overflow-hidden overflow-y-auto">
        
        {/* Decorative elements for the form side */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dark-pink via-purple-500 to-blue-500"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-dark-pink/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="w-full max-w-md mx-auto relative z-10 py-8">
          {/* Brand/Logo Area */}
          <Link to="/" className="inline-block mb-10 group">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-dark-pink to-purple-600 flex items-center justify-center text-white text-sm shadow-lg shadow-dark-pink/30 group-hover:rotate-12 transition-transform">S</span>
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Syncora</span>
            </h1>
          </Link>

          <div className="transition-all duration-500">
            {step === 'selection' ? (
              <div className="animate-fade-in-up">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold mb-3 text-white tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-gray-400 text-lg">Choose your account type to continue.</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setAccountType('customer')
                      setStep('form')
                    }}
                    className="w-full relative overflow-hidden flex items-center p-6 bg-[#111] border border-gray-800 rounded-2xl hover:border-dark-pink hover:bg-[#151214] focus:outline-none focus:ring-2 focus:ring-dark-pink/50 transition-all duration-300 group text-left shadow-lg hover:shadow-dark-pink/10 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-pink/0 via-dark-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-dark-pink/20 to-pink-600/10 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 group-hover:rotate-6 transition-all border border-dark-pink/20">
                      🛍️
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1 group-hover:text-dark-pink transition-colors">Customer</h3>
                      <p className="text-sm text-gray-400">Shop your favorite local stores</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all text-dark-pink">
                      →
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setAccountType('seller')
                      setStep('form')
                    }}
                    className="w-full relative overflow-hidden flex items-center p-6 bg-[#111] border border-gray-800 rounded-2xl hover:border-blue-500 hover:bg-[#121518] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 group text-left shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 group-hover:rotate-6 transition-all border border-blue-500/20">
                      🏪
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1 group-hover:text-blue-400 transition-colors">Store Owner</h3>
                      <p className="text-sm text-gray-400">Manage your business portal</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all text-blue-400">
                      →
                    </div>
                  </button>
                </div>

                <div className="mt-12 text-center sm:text-left">
                  <p className="text-gray-400">
                    New to Syncora?{' '}
                    <Link to="/register" className="text-dark-pink hover:text-pink-400 font-medium transition-colors hover:underline underline-offset-4">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <button 
                  onClick={() => setStep('selection')}
                  className="mb-8 flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors group"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform mr-2">←</span>
                  Back to selection
                </button>
                
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-white">
                    {accountType === 'seller' ? 'Seller Sign In' : 'Customer Sign In'}
                  </h2>
                  <p className="text-gray-400">Enter your details to access your account.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dark-pink focus:ring-1 focus:ring-dark-pink transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-300">Password</label>
                      <a href="#" className="text-sm text-dark-pink hover:text-pink-400 transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-dark-pink focus:ring-1 focus:ring-dark-pink transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3.5 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-shake mt-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-dark-pink to-pink-600 text-white px-4 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-dark-pink/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      'Sign In to Dashboard'
                    )}
                  </button>

                  <div className="mt-8 text-center text-sm text-gray-500">
                    By signing in, you agree to our <a href="#" className="underline hover:text-gray-300">Terms of Service</a> and <a href="#" className="underline hover:text-gray-300">Privacy Policy</a>.
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-black lg:h-full">
        <div 
          className="absolute inset-0 scale-105 transform hover:scale-100 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
        
        {/* Content over image */}
        <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex flex-col justify-end h-full">
          <div className="max-w-lg mb-8">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight tracking-tight">
              Welcome back to <br/><span className="font-bold">Syncora.</span>
            </h2>
            <p className="text-gray-300 text-lg font-light tracking-wide">
              Your gateway to the best local businesses, all in one seamless platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

