import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useStoreStore from '../stores/storeStore'
import Toast from '../components/Toast'
import StoreMap from '../components/StoreMap'

const FoodHome = () => {
  const navigate = useNavigate()
  const { setSelectedStore } = useStoreStore()
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [stores, setStores] = useState([])
  const [sortedStores, setSortedStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [hoveredStore, setHoveredStore] = useState(null)
  const [selectedNearestStore, setSelectedNearestStore] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)
  const [hoveredBrand, setHoveredBrand] = useState(null)

  const containerRef = useRef(null)
  const [orbitRadius, setOrbitRadius] = useState(280)

  useEffect(() => {
    const updateRadius = () => {
      setOrbitRadius(window.innerWidth < 768 ? 140 : 280)
    }
    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])

  // Brand icons mapping
  const brandIcons = {
    'Manohar Dairy': '🥛',
    'Bake N Shake': '🍰',
    'Cakes N Koffee': '☕',
    'Amul': '🧈',
    'Milan Sweets': '🍬'
  }

  // Brand gradient colors
  const brandGradients = {
    'Manohar Dairy': 'from-blue-600 via-cyan-500 to-blue-600',
    'Bake N Shake': 'from-pink-600 via-rose-500 to-pink-600',
    'Cakes N Koffee': 'from-amber-600 via-orange-500 to-amber-600',
    'Amul': 'from-yellow-500 via-yellow-400 to-yellow-500',
    'Milan Sweets': 'from-purple-600 via-pink-500 to-purple-600'
  }

  // Brand background images
  const brandImages = {
    'Manohar Dairy': 'https://media-cdn.tripadvisor.com/media/photo-s/0a/b5/d0/b4/manohar-dairy-restaurant.jpg',
    'Bake N Shake': 'https://www.architectmagazine.com/wp-content/uploads/sites/5/2021/c6493ebb4f27476f9da41b778075d88d.jpg?w=500',
    'Cakes N Koffee': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Amul': 'https://cdn.hisurat.com/business/amul-parlour-7/Amul%20Parlour_AF1QipMWkNsQanU2GYnw-tIcNL_NYQji-NxfEUzFghOO.jpeg.webp',
    'Milan Sweets': 'https://images.jdmagicbox.com/v2/comp/bhopal/c7/0755px755.x755.170928052731.r2c7/catalogue/milan-sweets-kolar-road-bhopal-sweet-shops-X9JJU28W2A.jpg'
  }

  useEffect(() => {
    loadBrands()
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      loadStores(selectedBrand.id)

    } else {
      setStores([])
    }
  }, [selectedBrand])

  const loadBrands = async () => {
    try {
      const { data } = await api.get('/brands')
      setBrands(data || [])
      console.log('Brands loaded:', data)
    } catch (error) {
      console.error('Error loading brands:', error)
      setToast({ message: 'Failed to load brands. Please check if backend is running.', type: 'error' })
      setBrands([]) // Set empty array to prevent infinite loading
    } finally {
      setLoading(false)
    }
  }

  const loadStores = async (brandId) => {
    try {
      const { data } = await api.get(`/brands/${brandId}/stores`)
      setStores(data)
      setSortedStores(data)
      setUserLocation(null)
      setLocationDetected(false)
      setSelectedNearestStore(null)
    } catch (error) {
      setToast({ message: 'Failed to load stores', type: 'error' })
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in kilometers
  }

  // Detect user location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setToast({ message: 'Geolocation is not supported by your browser', type: 'error' })
      return
    }

    setIsDetectingLocation(true)
    setToast({ message: 'Detecting your location...', type: 'info' })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        setLocationDetected(true)
        setIsDetectingLocation(false)
        setToast({ message: 'Location detected successfully!', type: 'success' })

        // Sort stores by distance
        const storesWithDistance = stores
          .filter(store => store.location)
          .map(store => ({
            ...store,
            distance: calculateDistance(
              latitude,
              longitude,
              store.location.lat,
              store.location.lng
            )
          }))
          .sort((a, b) => a.distance - b.distance)

        setSortedStores(storesWithDistance)
      },
      (error) => {
        setIsDetectingLocation(false)
        let errorMessage = 'Failed to detect location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setToast({ message: errorMessage, type: 'error' })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Select nearest store (highlight only, don't navigate)
  const handleSelectNearestStore = () => {
    if (!locationDetected || sortedStores.length === 0) {
      setToast({ message: 'Please detect your location first', type: 'error' })
      return
    }

    const nearestStore = sortedStores[0]
    if (nearestStore) {
      setSelectedNearestStore(nearestStore)
      setHoveredStore(nearestStore)
      setToast({ message: `Nearest store highlighted: ${nearestStore.Name}`, type: 'success' })
      
      // Scroll to the nearest store in the list
      const element = document.getElementById(`store-${nearestStore.Store_ID}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }


  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand)
  }

  const handleBackToBrands = () => {
    setSelectedBrand(null)
    setStores([])
  }

  const handleStoreSelect = (store) => {
    setSelectedStore(store)
    navigate(`/store/${store.Store_ID}`)
  }

  const handleStoreHover = (store) => {
    setHoveredStore(store)
  }

  const handleMarkerClick = (store) => {
    setHoveredStore(store)
    // Scroll to the store in the list
    const element = document.getElementById(`store-${store.Store_ID}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading brands...</div>
      </div>
    )
  }


  // Show stores view if a brand is selected
  if (selectedBrand) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://wallpaper-house.com/data/out/10/wallpaper2you_428182.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/75 via-gray-900/65 to-near-black/75"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,24,91,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(194,24,91,0.06),transparent_50%)]"></div>
        
        {/* Animated mesh gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 70%)
            `,
            backgroundSize: '200% 200%',
            animation: 'mesh-gradient 20s ease infinite'
          }}
        />
        
        {/* Large animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Pink blob - top left */}
          <div 
            className="absolute w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl animate-blob"
            style={{
              top: '-10%',
              left: '-10%',
            }}
          />
          
          {/* Pink blob - bottom right */}
          <div 
            className="absolute w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-3xl animate-blob-reverse"
            style={{
              bottom: '-10%',
              right: '-10%',
              animationDelay: '2s'
            }}
          />
          
          {/* Purple/pink blob - center */}
          <div 
            className="absolute w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animationDelay: '1s'
            }}
          />
          
          {/* Small accent blob - top right */}
          <div 
            className="absolute w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-3xl animate-blob"
            style={{
              top: '10%',
              right: '10%',
              animationDelay: '3s'
            }}
          />
        </div>
        
        {/* Animated wave patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div 
            className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-wave"
            style={{
              top: '-50%',
              left: '-50%',
              background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(236, 72, 153, 0.05) 10px, rgba(236, 72, 153, 0.05) 20px)'
            }}
          />
          <div 
            className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-wave"
            style={{
              top: '-50%',
              left: '-50%',
              animationDelay: '5s',
              background: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(168, 85, 247, 0.05) 10px, rgba(168, 85, 247, 0.05) 20px)'
            }}
          />
        </div>
        
        {/* Floating particles with enhanced movement */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
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
          {[...Array(20)].map((_, i) => (
            <div
              key={`enhanced-${i}`}
              className="absolute rounded-full animate-float-slow"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `rgba(236, 72, 153, ${0.2 + Math.random() * 0.3})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 15}s`,
                boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(236, 72, 153, 0.5)`
              }}
            />
          ))}
        </div>
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'wave 20s ease-in-out infinite'
          }}
        />
        
        {/* Pulsing radial gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(236,72,153,0.2),transparent_60%)] animate-pulse-glow"
            style={{ animationDuration: '6s' }}
          />
          <div 
            className="absolute w-full h-full bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.15),transparent_60%)] animate-pulse-glow"
            style={{ animationDuration: '8s', animationDelay: '2s' }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10 h-[calc(100vh-4rem)] flex flex-col">
          {/* Back Button */}
          <button
            onClick={handleBackToBrands}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group relative z-20"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 hover:border-pink-500/50 hover:bg-gray-900/60 transition-all duration-300">
              <svg 
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Brands</span>
            </div>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              {selectedBrand.name}
            </h1>
            <p className="text-white/60">Select a location to view products</p>
          </div>

          {/* Map and Store List Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Left Side - Map (50%) */}
            <div className="w-full h-full min-h-[400px] lg:min-h-0">
              <StoreMap
                stores={sortedStores}
                selectedStore={hoveredStore}
                onMarkerClick={handleMarkerClick}
                userLocation={userLocation}
              />
            </div>

            {/* Right Side - Store List (50%) */}
            <div className="w-full h-full flex flex-col min-h-0">
              {/* Location Detection Buttons - Above Store List */}
              <div className="mb-4 flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed"
                >
                  {isDetectingLocation ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Detect My Location</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSelectNearestStore}
                  disabled={!locationDetected || sortedStores.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-pink-500/50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Select Nearest Store</span>
                </button>

                {locationDetected && sortedStores.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Location detected • {sortedStores.length} stores sorted by distance</span>
                  </div>
                )}
              </div>

              {/* Store List */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                  {sortedStores.map((store, index) => {
                    const isHovered = hoveredStore && hoveredStore.Store_ID === store.Store_ID
                    const isNearestSelected = selectedNearestStore && selectedNearestStore.Store_ID === store.Store_ID
                    const isNearest = locationDetected && index === 0
                    
                    return (
                      <div
                        key={store.Store_ID}
                        id={`store-${store.Store_ID}`}
                        onClick={() => handleStoreSelect(store)}
                        onMouseEnter={() => handleStoreHover(store)}
                        onMouseLeave={() => {
                          if (!isNearestSelected) {
                            setHoveredStore(null)
                          }
                        }}
                        className={`group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-md border rounded-2xl p-6 cursor-pointer transition-all duration-500 overflow-hidden ${
                          isNearestSelected
                            ? 'border-blue-500/90 shadow-2xl shadow-blue-500/50 scale-[1.03] translate-x-2 ring-4 ring-blue-500/30'
                            : isHovered
                            ? 'border-pink-500/80 shadow-2xl shadow-pink-500/40 scale-[1.03] translate-x-2'
                            : 'border-gray-700/50 hover:border-pink-500/60 hover:shadow-xl hover:shadow-pink-500/20 hover:scale-[1.01]'
                        } animate-fade-in-up`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        {/* Animated gradient background */}
                        <div
                          className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                            isNearestSelected
                              ? 'bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-500/30 opacity-100'
                              : isHovered
                              ? 'bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-purple-500/0 opacity-100'
                              : 'bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-purple-500/0 opacity-0 group-hover:opacity-50'
                          }`}
                        />
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>

                        {/* Left border accent */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-500 ${
                          isNearestSelected
                            ? 'bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 opacity-100 w-2'
                            : isHovered
                            ? 'bg-gradient-to-b from-pink-500 via-purple-500 to-pink-500 opacity-100 w-1.5'
                            : 'bg-gradient-to-b from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-50'
                        }`} />

                        <div className="relative z-10">
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              {/* Location Icon */}
                              <div className={`relative mt-1 transition-all duration-500 ${
                                isNearestSelected ? 'scale-125 rotate-12' : isHovered ? 'scale-125 rotate-12' : 'group-hover:scale-110 group-hover:rotate-6'
                              }`}>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center backdrop-blur-sm">
                                  <svg 
                                    className={`w-6 h-6 transition-colors duration-300 ${
                                      isNearestSelected ? 'text-blue-400' : isHovered ? 'text-pink-400' : 'text-pink-500/70 group-hover:text-pink-400'
                                    }`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                {/* Pulse ring for active store */}
                                {isNearestSelected && (
                                  <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-ping opacity-75" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3
                                    className={`text-xl font-bold transition-all duration-300 ${
                                      isNearestSelected
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400'
                                        : isHovered 
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400' 
                                        : 'text-white group-hover:text-pink-300'
                                    }`}
                                  >
                                    {store.Name}
                                  </h3>
                                  {isNearestSelected && (
                                    <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-xs font-semibold animate-pulse">
                                      Nearest Selected
                                    </span>
                                  )}
                                  {isNearest && !isNearestSelected && locationDetected && (
                                    <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full text-green-300 text-xs font-semibold">
                                      Nearest
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-start gap-2 mb-3">
                                  <svg 
                                    className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                                    {store.address}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex flex-col items-end gap-2">
                              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                isNearestSelected
                                  ? 'bg-blue-500 scale-150 shadow-lg shadow-blue-500/50 animate-pulse'
                                  : isHovered 
                                  ? 'bg-pink-500 scale-150 shadow-lg shadow-pink-500/50' 
                                  : 'bg-green-500 group-hover:bg-pink-400 group-hover:scale-125'
                              }`} />
                              <div className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 ${
                                isNearestSelected
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : isHovered
                                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                  : 'bg-gray-800/50 text-white/50 group-hover:bg-pink-500/10 group-hover:text-pink-300'
                              }`}>
                                {store.Store_ID}
                              </div>
                            </div>
                          </div>

                          {/* Footer Section */}
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700/50">
                            <button className="group/btn flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold text-sm transition-all duration-300">
                              <span className="group-hover/btn:translate-x-1 transition-transform">
                                View Products
                              </span>
                              <svg 
                                className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </button>
                            
                            {/* Distance/Info Badge */}
                            <div className="flex items-center gap-2 text-xs">
                              {locationDetected && store.distance !== undefined ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="font-medium">
                                    {store.distance < 1 
                                      ? `${(store.distance * 1000).toFixed(0)}m away`
                                      : `${store.distance.toFixed(2)}km away`
                                    }
                                    {index === 0 && locationDetected && (
                                      <span className="ml-1 text-green-400">• Nearest</span>
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-white/40">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {sortedStores.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <div className="text-6xl mb-4">📍</div>
                    <p className="text-lg">No stores available for this brand</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    )
  }

  // Show brands view (initial state) - Vertical Accordion (Expandable Strips)
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Content Container - No dark overlays blocking content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-2 md:px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Culinary Destinations
          </h1>
          <p className="text-white/90 text-sm md:text-lg max-w-2xl mx-auto px-4">
            Discover our curated selection of distinguished brands
          </p>
        </div>

        {/* Vertical Accordion Container */}
        {brands.length > 0 ? (
          <div className="accordion-container w-full max-w-7xl h-[60vh] md:h-[70vh] flex gap-1 md:gap-2 lg:gap-4 relative z-10">
            {brands.map((brand, index) => {
            const bgImage = brandImages[brand.name] || 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            const gradient = brandGradients[brand.name] || 'from-gray-600 via-gray-500 to-gray-600'
            const isHovered = hoveredBrand === brand.id
            
            return (
              <div
                key={brand.id}
                onMouseEnter={() => setHoveredBrand(brand.id)}
                onMouseLeave={() => setHoveredBrand(null)}
                onClick={() => handleBrandSelect(brand)}
                className="accordion-item group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800/50 group-hover:border-pink-500/50 min-w-[60px] transition-all duration-700 ease-out"
                style={{ 
                  flex: isHovered ? '3 1 0%' : '1 1 0%'
                }}
              >
                {/* Background Image */}
                <img 
                  src={bgImage}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: 'brightness(1.15)' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                
                {/* Dark Overlay for Text Readability - Lighter */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-black/30" />
                
                {/* Content Container */}
                <div className="relative h-full flex flex-col items-center justify-center p-4 md:p-6">
                  {/* Brand Name - Horizontal when collapsed */}
                  <div className="flex items-center justify-center h-32 md:h-40 overflow-hidden">
                    <div className="flex flex-col items-center gap-1.5">
                      {brand.name.split(' ').map((word, wordIndex) => (
                        <h2 
                          key={wordIndex}
                          className={`text-xl md:text-2xl lg:text-3xl font-bold text-white transition-all duration-700 whitespace-nowrap`}
                          style={{
                            letterSpacing: '0.05em',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.9), -2px -2px 4px rgba(0,0,0,0.9), 2px -2px 4px rgba(0,0,0,0.9), -2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)',
                            WebkitTextStroke: '2px #000000',
                            WebkitTextStrokeWidth: '2px',
                            paintOrder: 'stroke fill'
                          }}
                        >
                          {word}
                        </h2>
                      ))}
                    </div>
                  </div>
                  
                  {/* Expanded Details - Only visible on hover */}
                  <div className={`absolute bottom-8 left-0 right-0 px-4 transition-all duration-700 delay-150 pointer-events-none ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <div className="text-center">
                      <p className="text-white/80 text-sm md:text-base mb-3">
                        Explore our collection
                      </p>
                      <span className="text-pink-400 text-sm font-semibold flex items-center justify-center gap-2">
                        Click to view stores
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700 -z-10`} />
              </div>
            )
          })}
          </div>
        ) : (
          <div className="text-center py-12 text-white/90 relative z-10">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl mb-2">No brands available</p>
            <p className="text-sm text-white/70">Please check if the backend server is running</p>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default FoodHome




