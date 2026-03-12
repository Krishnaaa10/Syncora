import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import useStoreStore from '../stores/storeStore'
import Toast from '../components/Toast'
import StoreMap from '../components/StoreMap'

const FoodHome = () => {
  const navigate = useNavigate()
  const { setSelectedStore } = useStoreStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [stores, setStores] = useState([])
  const [allStores, setAllStores] = useState([])
  const [cravingsData, setCravingsData] = useState([])
  const [quickPicksData, setQuickPicksData] = useState([])
  const [trendingStores, setTrendingStores] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Mock categories for stores based on Brand for discovery features
  const mockStoreCategories = {
    'Manohar Dairy': 'Sweets',
    'Bake N Shake': 'Bakery',
    'Cakes N Koffee': 'Desserts',
    'Amul': 'Dairy',
    'Milan Sweets': 'Sweets'
  }
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
    'Amul': '/images/amul-store.jpg',
    'Milan Sweets': 'https://images.jdmagicbox.com/v2/comp/bhopal/c7/0755px755.x755.170928052731.r2c7/catalogue/milan-sweets-kolar-road-bhopal-sweet-shops-X9JJU28W2A.jpg'
  }

  useEffect(() => {
    loadBrands()
    loadAllStores()
    loadHomeData()
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      loadStores(selectedBrand.id)
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

  const loadAllStores = async () => {
    try {
      const { data } = await api.get('/api/all-stores')
      // Map mock categories, ratings, and images
      const enhancedStores = (data || []).map(store => ({
        ...store,
        category: mockStoreCategories[store.Brand] || 'Meals',
        rating: (4.0 + Math.random() * 1.0).toFixed(1), // Mock rating between 4.0 and 5.0
        image: brandImages[store.Brand] || brandImages['Manohar Dairy']
      }))
      setAllStores(enhancedStores)
    } catch (error) {
      console.error('Error loading all stores:', error)
    }
  }

  const loadHomeData = async () => {
    try {
      const [
        { data: cravings },
        { data: picks },
        { data: trending }
      ] = await Promise.all([
        api.get('/api/home/cravings'),
        api.get('/api/home/quick-picks'),
        api.get('/api/home/trending')
      ])
      setCravingsData(cravings || [])
      setQuickPicksData(picks || [])
      
      const enhancedTrending = (trending || []).map(store => ({
        ...store,
        category: mockStoreCategories[store.Brand] || 'Meals',
        rating: (4.0 + Math.random() * 1.0).toFixed(1),
        image: brandImages[store.Brand] || brandImages['Manohar Dairy']
      }))
      setTrendingStores(enhancedTrending)
    } catch (error) {
      console.error('Error loading home data:', error)
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

  // Data now fetched from backend via loadHomeData

  // Read URL query parameter for dish filtering
  const selectedDish = searchParams.get("dish")

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
      <div className="h-screen relative overflow-hidden flex flex-col bg-black">
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

  // Compute derived state for discovery layout
  const categories = ['All', 'Sweets', 'Bakery', 'Fast Food', 'Dairy', 'Snacks', 'Desserts', 'Meals']
  


  // Trending stores fetched from backend
  
  // Featured brands: Top 6 brands
  const featuredBrands = brands.slice(0, 6)

  // --- Dynamic Discovery Data Generation --- //
  
  // Update Filter logic: Filter by store category, search text, AND by selected dish component
  const getFilteredStores = () => {
    if (!allStores) return []
    return allStores.filter(store => {
      if (!store) return false
      
      const storeName = store.Name || ''
      const storeCategory = store.category || ''
      const search = searchQuery || ''
      
      // Basic Search/Category Filter
      const matchesSearch = storeName.toLowerCase().includes(search.toLowerCase()) || 
                            storeCategory.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || storeCategory === selectedCategory;
      
      // Dish query param filter
      let matchesDish = true
      if (selectedDish && selectedCategory === 'All' && !searchQuery) {
        const craving = cravingsData?.find(c => c.name.toLowerCase() === selectedDish.toLowerCase())
        matchesDish = craving ? craving.stores.includes(store.Store_ID) : false
      }
      
      return matchesSearch && matchesCategory && matchesDish;
    })
  }

  // --- Static Promotion Data --- //
  const specialsData = [
    { id: 1, title: '20% OFF ON CAKES', store: 'Cakes N Koffee', gradient: 'from-pink-500 to-rose-500' },
    { id: 2, title: 'Buy 1 Get 1 Coffee', store: 'Bake N Shake', gradient: 'from-amber-500 to-orange-600' },
    { id: 3, title: 'Flat ₹50 Off Above ₹300', store: 'Manohar Dairy', gradient: 'from-blue-500 to-indigo-600' },
  ]

  const testimonialsData = [
    { id: 1, rating: 5, text: "The pastries from Cakes N Koffee are incredible!", author: "Rahul Sharma" },
    { id: 2, rating: 5, text: "Best Masala Dosa in town. Highly recommended!", author: "Priya Patel", store: "Manohar Dairy" },
    { id: 3, rating: 4, text: "Always fresh and delivered on time.", author: "Amit Verma" },
  ]

  // Show discovery layout (initial state)
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* 1. Smart Hero + Search */}
      <div className="pt-12 pb-8 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.1),transparent_70%)]" />
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center relative z-10">
          Find Your Next Meal
        </h1>
        
        <div className="w-full max-w-2xl relative z-10 mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search restaurants, sweets, snacks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/80 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all shadow-xl"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 relative z-10 max-w-3xl">
          <span className="text-gray-400 text-sm w-full text-center hidden md:block mb-1">Popular Categories</span>
          {categories.slice(1, 6).map(cat => (
            <button 
              key={cat}
              onClick={() => { 
                setSelectedCategory(cat); 
                setSearchParams({}); // Clear query when clicking a category
                document.getElementById('grid-section')?.scrollIntoView({ behavior: 'smooth' }) 
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                selectedCategory === cat 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 border border-pink-400'
                  : 'bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 text-white hover:border-pink-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
          {/* Active Dish Filter Pill */}
          {selectedDish && (
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/50 text-pink-300 rounded-full animate-fade-in-up mt-4 max-w-sm mx-auto">
              <span>Showing stores with: <strong className="text-white">{selectedDish}</strong></span>
              <button 
                onClick={() => { setSearchParams({}) }}
                className="hover:text-white bg-pink-500/30 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16 py-8">
        {/* Render filtered store grid if search or category or dish query is active */}
        {(searchQuery || selectedCategory !== 'All' || selectedDish) && (
          <section id="grid-section">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                {selectedDish ? `Stores selling ${selectedDish}` : `Explore ${selectedCategory !== 'All' ? selectedCategory : 'All Stores'}`}
              </h2>
              <span className="text-gray-400">{getFilteredStores().length} results</span>
            </div>
            
            {getFilteredStores().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredStores().map(store => (
                  <div 
                    key={store.Store_ID}
                    onClick={() => handleStoreSelect(store)}
                    className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={store.image} 
                        alt={store.Name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 border border-white/10">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-white font-medium text-sm">{store.rating}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-1 text-white group-hover:text-pink-400 transition-colors">{store.Name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-1">{store.address || 'Bhopal, MP'}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full">
                          {store.category}
                        </span>
                        <div className="flex items-center gap-1 text-pink-500 text-sm font-medium">
                          <span>View Menu</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold mb-2">No stores found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSearchParams({})
                  }}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* 2. Featured Brands */}
        {!searchQuery && selectedCategory === 'All' && !selectedDish && featuredBrands.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Brands</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 custom-scrollbar snap-x">
              {featuredBrands.map((brand) => (
                <div 
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand)}
                  className="flex-none w-72 h-48 rounded-2xl overflow-hidden relative group cursor-pointer border border-gray-800 hover:border-pink-500/50 transition-all duration-300 snap-start shadow-xl"
                >
                  <img src={brandImages[brand.name] || brandImages['Manohar Dairy']} alt={brand.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <h3 className="text-xl font-bold text-white mb-1">{brand.name}</h3>
                    <p className="text-sm text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Stores →</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Trending Near You */}
        {!searchQuery && selectedCategory === 'All' && !selectedDish && trendingStores.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">🔥 Trending Near You</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 custom-scrollbar snap-x">
              {trendingStores.map(store => (
                <div 
                  key={store.Store_ID}
                  onClick={() => handleStoreSelect(store)}
                  className="flex-none w-80 rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden cursor-pointer hover:scale-105 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 snap-start"
                >
                  <div className="h-40 relative">
                    <img src={store.image} alt={store.Name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-white font-medium text-sm">{store.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{store.Name}</h3>
                    <div className="text-gray-400 text-sm mb-3">{store.Brand} • {store.category}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> {(Math.random() * 5 + 1).toFixed(1)} km</span>
                      <span className="text-green-400">• Open Now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. What Are You Craving? */}
        {!searchQuery && selectedCategory === 'All' && !selectedDish && cravingsData.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">🔥 What Are You Craving?</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 custom-scrollbar snap-x">
              {cravingsData.map(craving => (
                <div 
                  key={craving.id}
                  className="flex-none w-40 group cursor-pointer hover:scale-105 transition-all duration-300 snap-start"
                  onClick={() => setSearchParams({ dish: craving.name })}
                >
                  <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-gray-800 group-hover:border-pink-500/50 shadow-lg relative bg-gray-800">
                    <img src={craving.image} loading="lazy" alt={craving.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-white mb-1 truncate">{craving.name}</h3>
                    <p className="text-xs text-gray-400">Available at {craving.storesCount} stores</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Quick Picks */}
        {!searchQuery && selectedCategory === 'All' && !selectedDish && quickPicksData.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">⚡ Quick Picks</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 custom-scrollbar snap-x">
              {quickPicksData.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    // Find the store inside allStores using storeId
                    const matchingStore = allStores.find(s => s.Store_ID === item.storeId)
                    if (matchingStore) {
                      handleStoreSelect(matchingStore)
                    }
                  }}
                  className="flex-none w-64 rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden cursor-pointer hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 snap-start flex flex-col"
                >
                  <div className="h-32 relative bg-gray-800">
                    <img src={item.image} loading="lazy" alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-white font-bold text-sm">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-400 truncate">from {item.storeName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Today's Specials */}
        {!searchQuery && selectedCategory === 'All' && !selectedDish && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">🎉 Today&apos;s Specials</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 custom-scrollbar snap-x">
              {specialsData.map(special => (
                <div 
                  key={special.id}
                  className={`flex-none w-80 md:w-96 rounded-2xl bg-gradient-to-br ${special.gradient} p-6 relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20 snap-start flex flex-col justify-between h-48`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-xl -ml-8 -mb-8" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-white/80 font-medium text-sm uppercase tracking-wider mb-2">{special.store}</span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight mb-4 flex-1">{special.title}</h3>
                    <button className="bg-white text-gray-900 font-bold py-2 px-4 rounded-lg w-fit text-sm hover:bg-gray-100 transition-colors shadow-lg">
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. What Customers Are Saying */}
        {!searchQuery && selectedCategory === 'All' && !selectedDish && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">💬 What Customers Are Saying</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 custom-scrollbar snap-x">
              {testimonialsData.map(testimonial => (
                <div 
                  key={testimonial.id}
                  className="flex-none w-80 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 flex flex-col justify-between hover:border-pink-500/30 transition-all duration-300 snap-start"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-300 italic mb-6">"{testimonial.text}"</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{testimonial.author}</h4>
                    {testimonial.store && <p className="text-xs text-pink-400 mt-1">{testimonial.store}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
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




