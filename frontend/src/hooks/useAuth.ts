"use client"

import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
  }
}
