import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized responses securely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only force logout for seller if it was a protected seller route that failed
      if (error.config && error.config.url && error.config.url.startsWith('/seller')) {
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('seller');
        localStorage.removeItem('sellerStore');
        
        // Only redirect if not already on the login page to avoid redirect loops
        if (window.location.pathname !== '/seller/login') {
          window.location.href = '/seller/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api

