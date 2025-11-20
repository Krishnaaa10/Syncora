import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const VerticalSelection = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleVerticalSelect = (vertical) => {
    if (vertical === 'food') {
      navigate('/food')
    } else {
      alert(`${vertical.charAt(0).toUpperCase() + vertical.slice(1)} vertical coming soon!`)
    }
  }

  const verticals = [
    {
      id: 'retail',
      name: 'Retail',
      icon: '🛍️',
      description: 'Discover amazing products from local retail stores',
      gradient: 'from-purple-600 via-purple-500 to-pink-600',
      bgGradient: 'from-purple-900/20 to-pink-900/20',
      bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      comingSoon: true,
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: '🍽️',
      description: 'Order from your favorite local restaurants',
      gradient: 'from-orange-500 via-red-500 to-orange-600',
      bgGradient: 'from-orange-900/20 to-red-900/20',
      bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      comingSoon: true,
    },
    {
      id: 'food',
      name: 'Food',
      icon: '🍰',
      description: 'Explore local food stores, sweets, snacks, and more',
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      bgGradient: 'from-pink-900/20 to-rose-900/20',
      bgImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      comingSoon: false,
    },
  ]

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background - Dark base */}
      <div className="absolute inset-0 bg-gradient-to-br from-near-black via-gray-900 to-near-black"></div>
      
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-near-black/95 via-gray-900/90 to-near-black/95"></div>
      
      {/* Pink Accent Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Diagonal pink lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-0 w-1 h-96 bg-gradient-to-b from-transparent via-dark-pink to-transparent opacity-60 transform rotate-12"></div>
          <div className="absolute top-40 right-20 w-1 h-80 bg-gradient-to-b from-transparent via-dark-pink to-transparent opacity-50 transform -rotate-12"></div>
          <div className="absolute bottom-32 left-1/4 w-1 h-72 bg-gradient-to-b from-transparent via-dark-pink to-transparent opacity-55 transform rotate-6"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-64 bg-gradient-to-b from-transparent via-dark-pink to-transparent opacity-45 transform -rotate-6"></div>
          <div className="absolute bottom-20 right-0 w-1 h-88 bg-gradient-to-b from-transparent via-dark-pink to-transparent opacity-50 transform rotate-12"></div>
        </div>
        {/* Horizontal pink lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-dark-pink to-transparent opacity-50"></div>
          <div className="absolute bottom-1/3 right-0 w-80 h-1 bg-gradient-to-l from-transparent via-dark-pink to-transparent opacity-45"></div>
          <div className="absolute top-2/3 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-dark-pink to-transparent opacity-40"></div>
        </div>
        {/* Radial gradients for pink glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(194,24,91,0.2),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(194,24,91,0.15),transparent_40%)]"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-dark-pink opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
            }}
          ></div>
        ))}
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-dark-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 pt-12 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-text-secondary to-dark-pink bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient leading-tight">
              Embark on Your Journey
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in a curated collection of local excellence, where every vertical unveils a world of possibilities and unparalleled experiences
            </p>
          </div>

          {/* Vertical Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-20">
            {verticals.map((vertical, index) => (
              <div
                key={vertical.id}
                onMouseEnter={() => setHoveredCard(vertical.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleVerticalSelect(vertical.id)}
                className={`
                  group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 rounded-3xl p-8 cursor-pointer 
                  transition-all duration-500 transform backdrop-blur-md
                  ${vertical.comingSoon ? 'border-gray-700/50 opacity-80' : 'border-dark-pink/50'}
                  ${hoveredCard === vertical.id ? 'scale-105 shadow-2xl shadow-dark-pink/30 -translate-y-2' : 'scale-100'}
                  ${!vertical.comingSoon ? 'hover:border-dark-pink hover:opacity-100' : ''}
                  animate-fade-in-up overflow-hidden
                `}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                  style={{
                    backgroundImage: `url('${vertical.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-800/70"></div>
                
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${vertical.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Coming Soon Badge */}
                {vertical.comingSoon && (
                  <div className="absolute top-6 right-6 bg-gray-800/90 backdrop-blur-sm text-text-secondary text-xs px-4 py-2 rounded-full border border-gray-700/50 z-10">
                    Coming Soon
                  </div>
                )}

                {/* Icon Container */}
                <div className="relative z-10 mb-8 flex justify-center">
                  <div className={`
                    relative w-28 h-28 rounded-3xl bg-gradient-to-br ${vertical.gradient} 
                    flex items-center justify-center text-5xl 
                    transform transition-all duration-500 shadow-2xl
                    ${hoveredCard === vertical.id ? 'rotate-12 scale-110 shadow-dark-pink/50' : 'rotate-0 scale-100'}
                  `}>
                    <div className="absolute inset-0 rounded-3xl bg-white/10 blur-xl"></div>
                    <div className="relative z-10">{vertical.icon}</div>
                    {/* Glow effect */}
                    <div className={`absolute -inset-2 bg-gradient-to-br ${vertical.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
                    {vertical.name}
                  </h2>
                  <p className="text-text-secondary mb-8 leading-relaxed text-base">
                    {vertical.description}
                  </p>

                  {!vertical.comingSoon && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-2 bg-dark-pink text-white px-8 py-3 rounded-full text-base font-semibold hover:opacity-90 transition-all transform group-hover:scale-105 shadow-lg shadow-dark-pink/30">
                        <span>Explore</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  )}

                  {vertical.comingSoon && (
                    <div className="text-center">
                      <span className="inline-block bg-gray-800/50 text-text-secondary px-6 py-2 rounded-full text-sm font-medium border border-gray-700/50">
                        Available Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-dark-pink/20 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-dark-pink/20 rounded-br-3xl"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-24 text-center animate-fade-in-up-delay-2">
            <p className="text-text-secondary text-lg mb-8">
              Can't find what you're looking for?
            </p>
            
            {/* Services Overview */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-2xl p-6 border border-gray-800/50 backdrop-blur-sm">
                  <div className="text-4xl mb-3">🍰</div>
                  <h3 className="text-lg font-bold mb-2 text-dark-pink">Food & Sweets</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Indulge in premium mithai, fresh snacks, namkeen, and authentic local delicacies delivered straight to your doorstep
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-2xl p-6 border border-gray-800/50 backdrop-blur-sm">
                  <div className="text-4xl mb-3">🛍️</div>
                  <h3 className="text-lg font-bold mb-2 text-dark-pink">Retail & Shopping</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Discover an extensive collection of products from local retailers, from everyday essentials to unique finds
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-2xl p-6 border border-gray-800/50 backdrop-blur-sm">
                  <div className="text-4xl mb-3">🍽️</div>
                  <h3 className="text-lg font-bold mb-2 text-dark-pink">Restaurant & Dining</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Savor exquisite meals from your favorite local restaurants with convenient delivery and pickup options
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-700 rounded-full text-text-secondary hover:border-dark-pink hover:text-dark-pink transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              <span>←</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerticalSelection
