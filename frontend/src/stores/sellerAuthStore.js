import { create } from 'zustand';
import api from '../api/axios';

const useSellerAuthStore = create((set, get) => ({
  seller: null,
  store: null,
  token: null,
  isAuthenticated: false,
  isAuthChecking: true,
  
  // New state variables for Multi-Brand Store Access
  selectedBrand: null,
  selectedStoreId: null,
  sellerStore: null,
  
  // Demo mode state
  isDemoMode: false,
  originalSellerStore: null,

  setSelectedBrand: (brand) => set({ selectedBrand: brand }),

  setSelectedStore: (store) => {
    const state = get();
    
    if (!state.isDemoMode) {
      set({
        originalSellerStore: state.sellerStore
      });
    }

    set({
      selectedStoreId: store.Store_ID,
      sellerStore: store,
      store: store,
      isDemoMode: true
    });
    localStorage.setItem("sellerStore", JSON.stringify(store));
  },

  exitDemoMode: () => {
    const state = get();
    
    set({
      sellerStore: state.originalSellerStore,
      store: state.originalSellerStore,
      selectedStoreId: state.originalSellerStore?.Store_ID,
      isDemoMode: false,
      originalSellerStore: null
    });
    
    if (state.originalSellerStore) {
      localStorage.setItem("sellerStore", JSON.stringify(state.originalSellerStore));
    }
  },

  register: async (sellerData) => {
    try {
      const { data } = await api.post('/seller/register', sellerData);
      set({
        seller: data.seller,
        store: data.store,
        token: data.token,
        isAuthenticated: true,
      });
      localStorage.setItem('sellerToken', data.token);
      localStorage.setItem('seller', JSON.stringify(data.seller));
      localStorage.setItem('sellerStore', JSON.stringify(data.store));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  login: async (email, password) => {
    try {
      const { data } = await api.post('/seller/login', { email, password });
      set({
        seller: data.seller,
        store: data.store,
        token: data.token,
        isAuthenticated: true,
      });
      localStorage.setItem('sellerToken', data.token);
      localStorage.setItem('seller', JSON.stringify(data.seller));
      localStorage.setItem('sellerStore', JSON.stringify(data.store));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  logout: () => {
    set({ 
      seller: null, 
      store: null, 
      sellerStore: null,
      selectedStoreId: null,
      selectedBrand: null,
      token: null, 
      isAuthenticated: false,
      isDemoMode: false,
      originalSellerStore: null
    });
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('seller');
    localStorage.removeItem('sellerStore');
  },

  setSellerStore: (store) => {
    set({ store, sellerStore: store, selectedStoreId: store?.Store_ID });
    localStorage.setItem('sellerStore', JSON.stringify(store));
  },

  initialize: async () => {
    const token = localStorage.getItem('sellerToken');
    
    if (!token) {
      set({
        seller: null,
        store: null,
        sellerStore: null,
        selectedStoreId: null,
        selectedBrand: null,
        token: null,
        isAuthenticated: false,
        isDemoMode: false,
        originalSellerStore: null,
        isAuthChecking: false
      });
      return;
    }

    try {
      const { data } = await api.get('/seller/me');
      set({
        token,
        seller: data.seller,
        store: data.store,
        sellerStore: data.store,
        selectedStoreId: data.store?.Store_ID || null,
        isAuthenticated: true,
        isAuthChecking: false
      });
      // Ensure sync with local storage if it was manually cleared but token remained
      localStorage.setItem('seller', JSON.stringify(data.seller));
      localStorage.setItem('sellerStore', JSON.stringify(data.store));
    } catch (e) {
      console.error('Session expired or invalid token');
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('seller');
      localStorage.removeItem('sellerStore');
      set({ 
        isAuthChecking: false, 
        isAuthenticated: false, 
        token: null, 
        seller: null, 
        store: null,
        sellerStore: null,
        selectedStoreId: null,
        selectedBrand: null,
        isDemoMode: false,
        originalSellerStore: null
      });
    }
  },
}));

export default useSellerAuthStore;
