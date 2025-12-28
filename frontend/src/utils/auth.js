/**
 * Authentication Utilities
 * Token management and auth state helpers
 */
import { API_CONFIG } from '@/config/api.config';

/**
 * Get access token from storage
 */
export const getAccessToken = () => {
  return localStorage.getItem(API_CONFIG.TOKEN.ACCESS_KEY);
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = () => {
  return localStorage.getItem(API_CONFIG.TOKEN.REFRESH_KEY);
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem(API_CONFIG.TOKEN.USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Set auth tokens in storage
 */
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(API_CONFIG.TOKEN.ACCESS_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(API_CONFIG.TOKEN.REFRESH_KEY, refreshToken);
  }
};

/**
 * Set user data in storage
 */
export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(API_CONFIG.TOKEN.USER_KEY, JSON.stringify(user));
  }
};

/**
 * Clear all auth data from storage
 */
export const clearAuth = () => {
  localStorage.removeItem(API_CONFIG.TOKEN.ACCESS_KEY);
  localStorage.removeItem(API_CONFIG.TOKEN.REFRESH_KEY);
  localStorage.removeItem(API_CONFIG.TOKEN.USER_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < exp;
  } catch {
    return false;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = () => {
  const token = getAccessToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};

/**
 * Check if token needs refresh
 * Returns true if token expires within threshold
 */
export const shouldRefreshToken = (thresholdMs = 5 * 60 * 1000) => {
  const expiration = getTokenExpiration();
  if (!expiration) return false;
  
  return expiration - Date.now() < thresholdMs;
};

/**
 * Parse JWT token payload
 */
export const parseToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};
