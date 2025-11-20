import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const Landing = () => {
  const navigate = useNavigate()
  const { isAuthenticated, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
    if (isAuthenticated) {
      navigate('/select-vertical')
    }
  }, [initialize, isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`,
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
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-dark-pink opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 15}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-dark-pink/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-dark-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-dark-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32 text-center relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-dark-pink/30 to-transparent"></div>
          
          <div className="animate-fade-in-up text-center">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-white via-text-secondary to-dark-pink bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient pb-3 overflow-visible relative z-10 block" style={{ textShadow: '0 0 30px rgba(194, 24, 91, 0.3)', lineHeight: '1.1' }}>
              Syncora
            </h1>
            <div className="block mb-6 px-4 py-2 bg-dark-pink/10 border border-dark-pink/30 rounded-full text-dark-pink text-sm font-semibold backdrop-blur-sm inline-block">
              ⚡ LOCAL EXCELLENCE PLATFORM
            </div>
            <p className="text-xl md:text-2xl text-text-secondary mb-4 max-w-3xl mx-auto font-light leading-relaxed">
              Connecting You with Local Excellence
            </p>
            <p className="text-lg text-text-secondary/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience seamless shopping across multiple verticals. Browse local stores, 
              order for delivery or pickup, and support your community with every purchase.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay">
                <Link
                  to="/register"
                  className="group bg-dark-pink text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-dark-pink/50 hover:shadow-xl hover:shadow-dark-pink/60 flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-dark-pink text-dark-pink px-8 py-4 rounded-full text-lg font-semibold hover:bg-dark-pink hover:text-white transition-all transform hover:scale-105 backdrop-blur-sm"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-dark-pink mb-2">25+</div>
                <div className="text-text-secondary text-sm">Local Stores</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-dark-pink mb-2">5+</div>
                <div className="text-text-secondary text-sm">Trusted Brands</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-dark-pink mb-2">150+</div>
                <div className="text-text-secondary text-sm">Products Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-dark-pink mb-2">24/7</div>
                <div className="text-text-secondary text-sm">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Visual cards */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800 backdrop-blur-sm hover:border-dark-pink/50 transition-all transform hover:scale-[1.02] shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-dark-pink to-pink-700 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      🛍️
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Multi-Vertical Shopping</h3>
                      <p className="text-text-secondary text-sm">Food, Furniture & More</p>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Explore food, furniture, restaurants, and more—all in one place. 
                    We're expanding to cover every aspect of your local shopping needs.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800 backdrop-blur-sm hover:border-dark-pink/50 transition-all transform hover:scale-[1.02] shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      📍
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Store Discovery</h3>
                      <p className="text-text-secondary text-sm">Map-Based Interface</p>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Find the best local stores near you with our intuitive map-based 
                    interface. See what's available in real-time.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800 backdrop-blur-sm hover:border-dark-pink/50 transition-all transition-all transform hover:scale-[1.02] shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      📦
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Flexible Ordering</h3>
                      <p className="text-text-secondary text-sm">Delivery or Pickup</p>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Choose between home delivery or convenient store pickup. 
                    Track your orders in real-time with live updates.
                  </p>
                </div>
              </div>

              {/* Right side - Visual grid */}
              <div className="relative">
                <div className="bg-gradient-to-br from-dark-pink/10 via-gray-900/50 to-transparent rounded-3xl p-12 backdrop-blur-sm border border-gray-800/50 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: '🍰', label: 'Food', color: 'from-pink-600 to-pink-800', desc: 'Sweets & Snacks' },
                      { icon: '🏪', label: 'Retail', color: 'from-amber-600 to-amber-800', desc: 'Home & Office' },
                      { icon: '🍽️', label: 'Restaurant', color: 'from-orange-600 to-orange-800', desc: 'Dining Out' },
                      { icon: '🛍️', label: 'More', color: 'from-purple-600 to-purple-800', desc: 'Coming Soon' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 text-center hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-110 hover:rotate-2 border border-gray-700 hover:border-dark-pink/50 cursor-pointer shadow-lg"
                      >
                        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-4xl shadow-lg transform group-hover:rotate-12 transition-transform`}>
                          {item.icon}
                        </div>
                        <div className="text-lg font-bold mb-1">{item.label}</div>
                        <div className="text-xs text-text-secondary">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up-delay-2">
              <div className="inline-block mb-4 px-4 py-2 bg-dark-pink/10 border border-dark-pink/30 rounded-full text-dark-pink text-sm font-semibold backdrop-blur-sm">
                OUR STORY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-text-secondary leading-relaxed mb-8 max-w-3xl mx-auto">
                At Syncora, we believe in empowering local businesses and creating meaningful 
                connections between communities and the stores they love. We're not just a 
                platform—we're a bridge that brings together customers and local merchants, 
                fostering growth, sustainability, and community spirit.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {[
                { icon: '🚀', title: 'Fast & Convenient', desc: 'Quick delivery and pickup options at your fingertips', gradient: 'from-blue-600 to-blue-800' },
                { icon: '🏪', title: 'Local First', desc: 'Support your neighborhood stores and local economy', gradient: 'from-green-600 to-green-800' },
                { icon: '✨', title: 'Seamless Experience', desc: 'Intuitive interface designed for your convenience', gradient: 'from-purple-600 to-purple-800' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm hover:border-dark-pink transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-dark-pink/20 group"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:rotate-12 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">{item.title}</h3>
                  <p className="text-text-secondary text-center leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Syncora?</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Everything you need for a seamless local shopping experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💳', title: 'Easy Payments', desc: 'Multiple payment options' },
                { icon: '🔔', title: 'Real-time Updates', desc: 'Get notified instantly' },
                { icon: '⭐', title: 'Verified Stores', desc: 'Trusted local businesses' },
                { icon: '🎁', title: 'Exclusive Deals', desc: 'Special offers daily' },
                { icon: '🚚', title: 'Fast Delivery', desc: 'Quick order fulfillment' },
                { icon: '🔄', title: 'Easy Returns', desc: 'Hassle-free process' },
                { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
                { icon: '📱', title: 'Mobile First', desc: 'Works on any device' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl p-6 border border-gray-800/50 hover:border-dark-pink/50 transition-all transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold mb-2 text-lg">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="bg-gradient-to-r from-dark-pink/20 via-gray-900/80 to-dark-pink/20 rounded-3xl p-12 border border-gray-800/50 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-pink/5 via-transparent to-dark-pink/5 animate-pulse"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                  Join thousands of customers discovering amazing local stores through Syncora. 
                  Create your account today and start exploring!
                </p>
                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowRegister(true)}
                      className="bg-dark-pink text-white px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-dark-pink/50 hover:shadow-xl hover:shadow-dark-pink/60 flex items-center justify-center gap-2"
                    >
                      <span>Create Account</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => setShowLogin(true)}
                      className="border-2 border-dark-pink text-dark-pink px-10 py-4 rounded-full text-lg font-semibold hover:bg-dark-pink hover:text-white transition-all backdrop-blur-sm"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-gray-800/50 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-4 text-dark-pink">Syncora</h4>
                <p className="text-text-secondary text-sm">
                  Empowering local businesses, connecting communities.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li><a href="#" className="hover:text-primary transition">About</a></li>
                  <li><a href="#" className="hover:text-primary transition">Careers</a></li>
                  <li><a href="#" className="hover:text-primary transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Connect</h4>
                <div className="flex gap-4">
                  {['📱', '📧', '🌐'].map((icon, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl hover:bg-dark-pink/20 transition cursor-pointer">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center text-text-secondary text-sm pt-8 border-t border-gray-800/50">
              <p className="mb-2">© 2025 Syncora. Empowering local businesses.</p>
              <p>Built with ❤️ for communities everywhere</p>
            </div>
          </div>
        </footer>
      </div>

    </div>
  )
}

export default Landing
