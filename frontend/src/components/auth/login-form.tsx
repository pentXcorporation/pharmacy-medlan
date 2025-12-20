"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/lib/services"
import { toast } from "sonner"
import type { LoginRequest } from "@/types"

export function LoginForm() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      console.log('Attempting login with:', credentials)
      const response = await authService.login(credentials)
      console.log('Full response:', JSON.stringify(response, null, 2))
      console.log('Response data:', JSON.stringify(response.data, null, 2))
      console.log('Response data.data:', JSON.stringify(response.data?.data, null, 2))
      
      if (response.data?.success && response.data?.data) {
        const data = response.data.data
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken || '')
          localStorage.setItem('userName', data.user?.fullName || data.user?.username || 'Admin User')
          localStorage.setItem('userRole', data.user?.role || 'ADMIN')
          localStorage.setItem('branchId', data.user?.branchId?.toString() || '1')
          toast.success('Login successful')
          router.push('/dashboard')
        } else {
          throw new Error('Invalid response structure')
        }
      } else {
        throw new Error(response.data?.message || 'Invalid credentials')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      let errorMsg = 'Login failed. Please try again.'
      
      if (err.message?.includes('Cannot connect')) {
        errorMsg = 'Cannot connect to server. Please ensure backend is running on http://localhost:8080'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the pharmacy system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
