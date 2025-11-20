import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, token, isAuthenticated: true })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed'
      return { success: false, error: errorMessage }
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, token, isAuthenticated: true })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed'
      return { success: false, error: errorMessage }
    }
  },

  // Google Sign-In - will be added later
  // loginWithGoogle: async (credential) => {
  //   try {
  //     const response = await api.post('/auth/google', { credential })
  //     const { token, user } = response.data
  //     localStorage.setItem('token', token)
  //     localStorage.setItem('user', JSON.stringify(user))
  //     set({ user, token, isAuthenticated: true })
  //     return { success: true }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.error || error.message || 'Google login failed'
  //     return { success: false, error: errorMessage }
  //   }
  // },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  initialize: () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      set({ 
        token, 
        user: JSON.parse(userStr), 
        isAuthenticated: true 
      })
    }
  },
}))

export default useAuthStore

