/**
 * JWT Helper Functions
 * Utilities for working with JWT tokens
 */

/**
 * Decode JWT token payload (without verification)
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @param {number} bufferSeconds - Buffer time before actual expiry (default: 60)
 * @returns {boolean}
 */
export const isTokenExpired = (token, bufferSeconds = 60) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const bufferTime = bufferSeconds * 1000;
  
  return Date.now() >= expiryTime - bufferTime;
};

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiry date or null
 */
export const getTokenExpiryTime = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;
  
  return new Date(payload.exp * 1000);
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number} - Milliseconds until expiry (negative if expired)
 */
export const getTimeUntilExpiry = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return 0;
  
  const expiryTime = payload.exp * 1000;
  return expiryTime - Date.now();
};

/**
 * Get user ID from token
 * @param {string} token - JWT token
 * @returns {string|null}
 */
export const getUserIdFromToken = (token) => {
  const payload = decodeToken(token);
  return payload?.sub || payload?.userId || payload?.id || null;
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null}
 */
export const getRoleFromToken = (token) => {
  const payload = decodeToken(token);
  return payload?.role || payload?.roles?.[0] || null;
};

/**
 * Get token issued time
 * @param {string} token - JWT token
 * @returns {Date|null}
 */
export const getTokenIssuedTime = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.iat) return null;
  
  return new Date(payload.iat * 1000);
};

/**
 * Check if token will expire soon
 * @param {string} token - JWT token
 * @param {number} thresholdMinutes - Minutes threshold (default: 5)
 * @returns {boolean}
 */
export const isTokenExpiringSoon = (token, thresholdMinutes = 5) => {
  const timeUntilExpiry = getTimeUntilExpiry(token);
  const thresholdMs = thresholdMinutes * 60 * 1000;
  
  return timeUntilExpiry > 0 && timeUntilExpiry <= thresholdMs;
};

/**
 * Validate token format
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check if each part is valid base64
  try {
    parts.forEach(part => {
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    });
    return true;
  } catch {
    return false;
  }
};
