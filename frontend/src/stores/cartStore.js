import { create } from 'zustand'
import api from '../api/axios'

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  addItem: async (product, quantity = 1) => {
    const items = get().items
    const existingItem = items.find(item => item.id === product.Item_ID)
    
    // Fetch current stock
    try {
      const { data: currentProduct } = await api.get(`/products/${product.Item_ID}`)
      const availableStock = currentProduct.Stock_Available || 0
      const currentQty = existingItem?.quantity || 0
      const newQty = currentQty + quantity

      if (newQty > availableStock) {
        throw new Error(`Only ${availableStock} units available in stock`)
      }

      if (existingItem) {
        const updatedItems = items.map(item =>
          item.id === product.Item_ID
            ? { ...item, quantity: newQty }
            : item
        )
        set({ items: updatedItems })
        localStorage.setItem('cart', JSON.stringify(updatedItems))
      } else {
        const newItems = [...items, {
          id: product.Item_ID,
          name: product.Item_Name,
          price: product.Price,
          quantity,
          storeId: product.Store_ID,
          unitSize: product.Unit_Size,
          stockAvailable: availableStock,
        }]
        set({ items: newItems })
        localStorage.setItem('cart', JSON.stringify(newItems))
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  removeItem: (itemId) => {
    const items = get().items.filter(item => item.id !== itemId)
    set({ items })
    localStorage.setItem('cart', JSON.stringify(items))
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    const items = get().items
    const item = items.find(i => i.id === itemId)
    if (!item) return

    // Fetch current stock
    try {
      const { data: currentProduct } = await api.get(`/products/${itemId}`)
      const availableStock = currentProduct.Stock_Available || 0

      if (quantity > availableStock) {
        throw new Error(`Only ${availableStock} units available in stock`)
      }

      const updatedItems = items.map(i =>
        i.id === itemId ? { ...i, quantity, stockAvailable: availableStock } : i
      )
      set({ items: updatedItems })
      localStorage.setItem('cart', JSON.stringify(updatedItems))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  clearCart: () => {
    set({ items: [] })
    localStorage.removeItem('cart')
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },
}))

export default useCartStore

