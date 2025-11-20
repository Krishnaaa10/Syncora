import { create } from 'zustand'

const useStoreStore = create((set) => ({
  selectedStore: JSON.parse(localStorage.getItem('selectedStore') || 'null'),

  setSelectedStore: (store) => {
    localStorage.setItem('selectedStore', JSON.stringify(store))
    set({ selectedStore: store })
  },

  clearSelectedStore: () => {
    localStorage.removeItem('selectedStore')
    set({ selectedStore: null })
  },
}))

export default useStoreStore

