import { useState } from 'react'
import { useEffect } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Send contact form data to backend
      const api = (await import('../api/axios')).default
      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
      
      setLoading(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
      
    } catch (error) {
      console.error('Error sending email:', error)
      setLoading(false)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send message'
      alert(`Failed to send message: ${errorMessage}\n\nPlease make sure:\n1. Backend server is running\n2. Gmail credentials are set in backend/.env file`)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-6 px-4 py-2 bg-dark-pink/10 border border-dark-pink/30 rounded-full text-dark-pink text-sm font-semibold backdrop-blur-sm">
              GET IN TOUCH
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-text-secondary to-dark-pink bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient leading-tight">
              Contact Us
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Have questions or feedback? We'd love to hear from you. Reach out and let's start a conversation.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8 animate-fade-in-up-delay">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800/50 backdrop-blur-md shadow-xl">
                  <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-dark-pink bg-clip-text text-transparent">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    {[
                      {
                        icon: '📧',
                        title: 'Email',
                        content: 'support@syncora.com',
                        link: 'mailto:support@syncora.com'
                      },
                      {
                        icon: '📱',
                        title: 'Phone',
                        content: '987654321',
                        link: 'tel:987654321'
                      },
                      {
                        icon: '📍',
                        title: 'Address',
                        content: '225, Large dining - 2, VIT BHOPAL UNIVERSITY',
                        link: null
                      },
                      {
                        icon: '🕒',
                        title: 'Business Hours',
                        content: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM',
                        link: null
                      },
                    ].map((info, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-dark-pink/20 to-pink-700/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1 text-lg">{info.title}</h3>
                          {info.link ? (
                            <a 
                              href={info.link}
                              className="text-text-secondary hover:text-dark-pink transition-colors whitespace-pre-line"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-text-secondary whitespace-pre-line">{info.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800/50 backdrop-blur-md shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                  <div className="flex gap-4">
                    {['📘', '📷', '🐦', '💼'].map((icon, index) => (
                      <div
                        key={index}
                        className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-2xl hover:bg-gradient-to-br hover:from-dark-pink/20 hover:to-pink-700/20 transition-all transform hover:scale-110 cursor-pointer border border-gray-700 hover:border-dark-pink/50"
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="animate-fade-in-up-delay-2">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-800/50 backdrop-blur-md shadow-xl">
                  <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-dark-pink bg-clip-text text-transparent">
                    Send us a Message
                  </h2>

                  {submitted && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400 animate-fade-in">
                      ✓ Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-text-secondary mb-2 font-medium">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-text-secondary mb-2 font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition backdrop-blur-sm"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-text-secondary mb-2 font-medium">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition backdrop-blur-sm"
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-text-secondary mb-2 font-medium">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/50 transition backdrop-blur-sm resize-none"
                        placeholder="Tell us how we can help..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-dark-pink text-white px-6 py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-dark-pink/30"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

