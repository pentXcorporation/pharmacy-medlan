import api from './api'
import type { LoginRequest, LoginResponse } from '@/types'

export const authService = {
  login: async (credentials: LoginRequest) => {
    const { data } = await api.post<LoginResponse>('/api/auth/login', credentials)
    
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))
    }
    
    return data
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    if (!user || user === 'undefined') return null
    try {
      return JSON.parse(user)
    } catch {
      return null
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken')
  },
}
