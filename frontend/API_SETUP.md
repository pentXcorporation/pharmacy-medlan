# API Integration Setup

## Environment Configuration

1. Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

2. Update the URL to match your backend server

## Architecture

### API Client (`src/lib/api.ts`)
- Axios instance with base URL from environment
- Request interceptor: Adds Bearer token to all requests
- Response interceptor: Handles 401 errors and redirects to login

### Auth Service (`src/lib/auth.ts`)
- `login()` - Authenticates user and stores tokens
- `logout()` - Clears tokens and user data
- `getUser()` - Retrieves current user from localStorage
- `isAuthenticated()` - Checks if user has valid token

### Custom Hook (`src/hooks/useAuth.ts`)
- Provides authentication state to components
- Returns: `user`, `isLoading`, `isAuthenticated`

## Usage Examples

### Login
```typescript
import { authService } from '@/lib/auth'

const response = await authService.login({
  username: 'admin',
  password: 'admin123'
})
```

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function Page() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  )
}
```

### API Calls
```typescript
import api from '@/lib/api'

// GET request
const { data } = await api.get('/api/products')

// POST request
const { data } = await api.post('/api/products', {
  name: 'Medicine',
  price: 10.99
})
```

## Token Management

- Access token stored in localStorage
- Automatically attached to all API requests
- Auto-redirect to login on 401 errors
- Tokens cleared on logout

## Type Safety

All API responses are typed:
```typescript
interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
    user: User
  }
}
```
