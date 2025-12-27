import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */
const AuthContext = createContext(null);

/**
 * Get stored user from localStorage
 */
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Get stored token from localStorage
 */
const getStoredToken = () => {
  try {
    return localStorage.getItem('token') || null;
  } catch {
    return null;
  }
};

/**
 * Get stored branch from localStorage
 */
const getStoredBranch = () => {
  try {
    const stored = localStorage.getItem('selectedBranch');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * AuthProvider Component
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [selectedBranch, setSelectedBranchState] = useState(getStoredBranch);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  /**
   * Login user and store credentials
   */
  const login = useCallback((userData, accessToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
    setUser(userData);
    setToken(accessToken);
  }, []);

  /**
   * Logout user and clear stored credentials
   */
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedBranch');
    setUser(null);
    setToken(null);
    setSelectedBranchState(null);
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  /**
   * Set selected branch
   */
  const setSelectedBranch = useCallback((branch) => {
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
    setSelectedBranchState(branch);
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role) => {
    if (!user?.role) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((permission) => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const value = {
    user,
    token,
    selectedBranch,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    setSelectedBranch,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
