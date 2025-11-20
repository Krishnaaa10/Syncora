import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useCartStore from '../stores/cartStore'
import Toast from '../components/Toast'

const ProductPage = () => {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [toast, setToast] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    loadProduct()
  }, [itemId])

  const loadProduct = async () => {
    try {
      const { data } = await api.get(`/products/${itemId}`)
      setProduct(data)
      setImageError(false)
    } catch (error) {
      setToast({ message: 'Failed to load product', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    const result = await addItem(product, quantity)
    if (result.success) {
      setToast({ message: `${product.Item_Name} added to cart`, type: 'success' })
    } else {
      setToast({ message: result.error || 'Failed to add to cart', type: 'error' })
    }
  }

  // Get image URLs - use Image_URL if available, otherwise create placeholder array
  const getImageUrls = () => {
    if (product?.Image_URL) {
      // For now, use the same image for all thumbnails
      // In future, this could be an array of images
      return [product.Image_URL, product.Image_URL, product.Image_URL]
    }
    return []
  }

  const imageUrls = getImageUrls()
  const hasImages = imageUrls.length > 0 && product?.Image_URL

  if (loading) {
    return (
      <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://www.hdwallpapers.in/download/dark_rose_flower_petals_with_water_drops_in_black_background_hd_flowers-HD.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/75 via-gray-900/70 to-near-black/75"></div>
        <div className="relative z-10 container mx-auto px-4 py-8 text-center min-h-screen flex items-center justify-center">
          <div className="animate-pulse">
            <div className="text-text-secondary text-xl">Loading product...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://www.hdwallpapers.in/download/dark_rose_flower_petals_with_water_drops_in_black_background_hd_flowers-HD.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/75 via-gray-900/70 to-near-black/75"></div>
        <div className="relative z-10 container mx-auto px-4 py-8 text-center min-h-screen flex flex-col items-center justify-center">
          <div className="text-text-secondary text-xl mb-4">Product not found</div>
          <button
            onClick={() => navigate('/food')}
            className="mt-4 px-6 py-2 bg-dark-pink text-white rounded-lg hover:opacity-90 transition"
          >
            Back to Stores
          </button>
        </div>
      </div>
    )
  }

  const maxQuantity = product.Stock_Available || 0

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://www.hdwallpapers.in/download/dark_rose_flower_petals_with_water_drops_in_black_background_hd_flowers-HD.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-near-black/75 via-gray-900/70 to-near-black/75"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,24,91,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(194,24,91,0.1),transparent_50%)]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-text-secondary hover:text-primary mb-8 flex items-center gap-2 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back</span>
        </button>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl group backdrop-blur-md">
            {hasImages && !imageError ? (
              <>
                <img
                  src={imageUrls[selectedImage]}
                  alt={product.Item_Name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-50">📦</div>
                  <p className="text-text-secondary text-sm">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {hasImages && (
            <div className="flex gap-3">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index)
                    setImageError(false)
                  }}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-dark-pink ring-2 ring-dark-pink/50 scale-105'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {!imageError ? (
                    <img
                      src={url}
                      alt={`${product.Item_Name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => {
                        if (selectedImage === index) setImageError(true)
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-2xl opacity-50">📦</span>
                    </div>
                  )}
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-dark-pink/20" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="text-5xl font-bold mb-3 text-primary leading-tight">
              {product.Item_Name}
            </h1>
            
            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-text-secondary border border-gray-700">
                {product.Category}
              </span>
              <span className="text-text-secondary">•</span>
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-text-secondary border border-gray-700">
                {product.Sub_Category}
              </span>
            </div>

            {/* Rating & SKU */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-lg">★★★★☆</span>
                <span className="text-text-secondary">(4.0)</span>
              </div>
              <span className="text-text-secondary">•</span>
              <span className="text-text-secondary font-mono">SKU: {product.Item_ID}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="py-6 border-y border-gray-800">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-bold text-dark-pink">
                ₹{product.Price}
              </span>
            </div>
            <div className="text-text-secondary">
              Unit: <span className="text-primary">{product.Unit_Size}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
            <h3 className="font-bold text-lg mb-3 text-primary">Description</h3>
            <p className="text-text-secondary leading-relaxed">
              {product.Item_Name} is a premium {product.Category} item from the {product.Sub_Category} collection. 
              Available in {product.Unit_Size} packaging.
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-lg">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    setQuantity(Math.min(maxQuantity, Math.max(1, val)))
                  }}
                  min="1"
                  max={maxQuantity}
                  className="w-20 text-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-semibold focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20"
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="w-10 h-10 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold text-lg"
                >
                  +
                </button>
              </div>
              <span className="text-text-secondary text-sm">
                ({maxQuantity} available)
              </span>
            </div>

            {maxQuantity > 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-dark-pink to-pink-600 text-white py-4 rounded-xl text-lg font-bold hover:from-pink-600 hover:to-dark-pink transition-all shadow-lg shadow-dark-pink/20 hover:shadow-xl hover:shadow-dark-pink/30 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-800 text-text-secondary py-4 rounded-xl text-lg font-semibold cursor-not-allowed border border-gray-700"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-800">
            <div className="text-sm text-text-secondary space-y-1">
              <p>Last Updated: <span className="text-primary">{product.Last_Updated}</span></p>
              <p>Store ID: <span className="text-primary font-mono">{product.Store_ID}</span></p>
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
    </div>
  )
}

export default ProductPage

