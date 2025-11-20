import { useEffect } from 'react'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      ></div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-near-black/90 via-gray-900/85 to-near-black/90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,24,91,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(194,24,91,0.1),transparent_50%)]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
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
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block mb-6 px-4 py-2 bg-dark-pink/10 border border-dark-pink/30 rounded-full text-dark-pink text-sm font-semibold backdrop-blur-sm">
              OUR STORY
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-text-secondary to-dark-pink bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient leading-tight">
              About Syncora
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Empowering local businesses and connecting communities through innovative technology
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-12 border border-gray-800/50 backdrop-blur-md shadow-2xl animate-fade-in-up-delay">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-dark-pink to-pink-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  🎯
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-dark-pink bg-clip-text text-transparent">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-text-secondary leading-relaxed text-center max-w-4xl mx-auto">
                At Syncora, we believe in empowering local businesses and creating meaningful 
                connections between communities and the stores they love. We're not just a 
                platform—we're a bridge that brings together customers and local merchants, 
                fostering growth, sustainability, and community spirit. Our mission is to make 
                local shopping accessible, convenient, and delightful for everyone.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in-up-delay-2">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🚀',
                  title: 'Innovation',
                  description: 'We continuously evolve our platform with cutting-edge technology to provide the best user experience and support for local businesses.',
                  gradient: 'from-blue-600 to-blue-800'
                },
                {
                  icon: '❤️',
                  title: 'Community First',
                  description: 'Every decision we make prioritizes the well-being and growth of local communities and the businesses that serve them.',
                  gradient: 'from-pink-600 to-pink-800'
                },
                {
                  icon: '✨',
                  title: 'Excellence',
                  description: 'We strive for excellence in every interaction, ensuring quality service, reliability, and satisfaction for all our users.',
                  gradient: 'from-purple-600 to-purple-800'
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800/50 backdrop-blur-md hover:border-dark-pink/50 transition-all transform hover:scale-105 shadow-xl animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 0.15}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg transform hover:rotate-12 transition-transform`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">{value.title}</h3>
                  <p className="text-text-secondary text-center leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-12 border border-gray-800/50 backdrop-blur-md shadow-2xl animate-fade-in-up-delay-2">
              <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { number: '25+', label: 'Local Stores' },
                  { number: '5+', label: 'Trusted Brands' },
                  { number: '24/7', label: 'Support' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-5xl md:text-6xl font-bold text-dark-pink mb-3">{stat.number}</div>
                    <div className="text-text-secondary text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team/Story Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-12 border border-gray-800/50 backdrop-blur-md shadow-2xl animate-fade-in-up-delay-2">
              <h2 className="text-4xl font-bold text-center mb-8">Our Journey</h2>
              <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
                <p>
                  Syncora was born from a simple yet powerful vision: to create a platform that 
                  celebrates and supports local businesses while making shopping convenient and 
                  enjoyable for consumers. We recognized that local merchants are the backbone 
                  of our communities, and they deserve the same digital tools and reach as larger 
                  corporations.
                </p>
                <p>
                  Since our inception, we've been committed to building technology that truly 
                  serves local businesses. Our platform enables merchants to reach more customers, 
                  manage their operations efficiently, and grow their businesses sustainably. 
                  For consumers, we provide a seamless way to discover, explore, and support 
                  local businesses in their communities.
                </p>
                <p>
                  Today, Syncora continues to evolve, adding new features and verticals to serve 
                  an ever-expanding range of local businesses. We're proud to be part of the 
                  movement that's keeping local commerce vibrant and thriving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

