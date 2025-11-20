import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useCartStore from '../stores/cartStore'
import Toast from '../components/Toast'


const StorePage = () => {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [toast, setToast] = useState(null)
  const [imageLoadErrors, setImageLoadErrors] = useState({})
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    loadProducts()
  }, [storeId])

  useEffect(() => {
    applyFilters()
  }, [products, selectedCategory, selectedSubCategory])

  const loadProducts = async () => {
    try {
      const { data } = await api.get(`/stores/${storeId}/products`)
      setProducts(data)
      
      // Debug: Check if Image_URL is present
      console.log('=== PRODUCTS DEBUG ===')
      console.log('Total products loaded:', data.length)
      console.log('First product:', data[0])
      console.log('First product keys:', Object.keys(data[0] || {}))
      const productsWithImages = data.filter(p => p.Image_URL)
      console.log('Products with Image_URL:', productsWithImages.length)
      if (productsWithImages.length > 0) {
        console.log('Sample product with image:', productsWithImages[0])
        console.log('Image URL:', productsWithImages[0].Image_URL)
      } else {
        console.log('NO PRODUCTS HAVE Image_URL FIELD!')
        console.log('Sample product without image:', data[0])
      }
      console.log('=====================')
      
      // Extract unique categories and subcategories
      const cats = [...new Set(data.map(p => p.Category))].sort()
      const subCats = [...new Set(data.map(p => p.Sub_Category))].sort()
      setCategories(cats)
      setSubCategories(subCats)
    } catch (error) {
      console.error('Error loading products:', error)
      setToast({ message: 'Failed to load products', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.Category === selectedCategory)
    }

    if (selectedSubCategory !== 'all') {
      filtered = filtered.filter(p => p.Sub_Category === selectedSubCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = async (product) => {
    const result = await addItem(product, 1)
    if (result.success) {
      setToast({ message: `${product.Item_Name} added to cart`, type: 'success' })
    } else {
      setToast({ message: result.error || 'Failed to add to cart', type: 'error' })
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
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
        
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <div className="text-text-secondary">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-near-black text-primary overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
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
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-dark-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-dark-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">Store Products</h1>
          <p className="text-text-secondary">Browse our wide selection of products</p>
        </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-text-secondary text-sm mb-2 font-medium">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedSubCategory('all')
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transition"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-text-secondary text-sm mb-2 font-medium">Sub Category</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-dark-pink focus:ring-2 focus:ring-dark-pink/20 transition"
          >
            <option value="all">All Sub Categories</option>
            {subCategories
              .filter(sub => selectedCategory === 'all' || products.some(p => p.Category === selectedCategory && p.Sub_Category === sub))
              .map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-text-secondary text-sm">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
      </div>

      {/* Product Grid - Ecommerce Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.Item_ID}
            className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:shadow-xl hover:shadow-dark-pink/10 transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => navigate(`/product/${product.Item_ID}`)}
          >
            {/* Product Image Container */}
            <div className="relative w-full h-64 bg-gray-800 overflow-hidden">
              {product.Image_URL && !imageLoadErrors[product.Item_ID] ? (
                <>
                  <img
                    src={product.Image_URL}
                    alt={product.Item_Name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      console.error('❌ Image failed to load:', {
                        product: product.Item_Name,
                        url: product.Image_URL,
                        error: e
                      })
                      setImageLoadErrors(prev => ({ ...prev, [product.Item_ID]: true }))
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully:', product.Item_Name, product.Image_URL)
                    }}
                  />
                  {/* Debug indicator - remove after testing */}
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Has URL
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <span className="text-6xl opacity-50">📦</span>
                  {!product.Image_URL && (
                    <div className="absolute bottom-2 left-2 text-xs text-red-400 bg-red-900/50 px-2 py-1 rounded">
                      No Image_URL field
                    </div>
                  )}
                  {imageLoadErrors[product.Item_ID] && (
                    <div className="absolute bottom-2 left-2 text-xs text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded">
                      Image load failed
                    </div>
                  )}
                </div>
              )}
              
              {/* Stock Badge */}
              {product.Stock_Available === 0 && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Out of Stock
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {product.Category}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex-1 flex flex-col">
              {/* Product Name */}
              <h3 className="text-lg font-semibold mb-2 text-primary line-clamp-2 group-hover:text-dark-pink transition-colors">
                {product.Item_Name}
              </h3>
              
              {/* Sub Category */}
              <p className="text-text-secondary text-xs mb-3">
                {product.Sub_Category}
              </p>
              
              {/* Unit Size */}
              <p className="text-text-secondary text-xs mb-4">
                {product.Unit_Size}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-sm">★★★★☆</span>
                </div>
                <span className="text-text-secondary text-xs">(4.0)</span>
                <span className="text-text-secondary text-xs">•</span>
                <span className="text-text-secondary text-xs">{product.Stock_Available} in stock</span>
              </div>

              {/* Price and Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-dark-pink">₹{product.Price}</div>
                  </div>
                </div>

                {product.Stock_Available > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    className="w-full bg-dark-pink text-white py-3 rounded-lg font-medium hover:bg-dark-pink/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-dark-pink/20"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-800 text-text-secondary py-3 rounded-lg font-medium cursor-not-allowed opacity-60"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <div className="text-xl font-semibold text-primary mb-2">No products found</div>
          <div className="text-text-secondary">Try adjusting your filters to see more products.</div>
        </div>
      )}

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

export default StorePage

