import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, (error) => {
  console.error('Request error:', error)
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network Error: Backend not reachable at', error.config?.baseURL)
      return Promise.reject(new Error('Cannot connect to server. Please ensure backend is running on http://localhost:8080'))
    }
    
    console.error('API Error:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
