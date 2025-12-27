import { TOKEN_CONFIG } from '../constants/authConstants';

/**
 * Token Service
 * Handles token storage and management
 */
export const tokenService = {
  /**
   * Get access token from storage
   * @returns {string|null}
   */
  getAccessToken: () => {
    try {
      return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Set access token in storage
   * @param {string} token
   */
  setAccessToken: (token) => {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
  },

  /**
   * Get refresh token from storage
   * @returns {string|null}
   */
  getRefreshToken: () => {
    try {
      return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Set refresh token in storage
   * @param {string} token
   */
  setRefreshToken: (token) => {
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
  },

  /**
   * Set both tokens
   * @param {string} accessToken
   * @param {string} refreshToken
   */
  setTokens: (accessToken, refreshToken) => {
    tokenService.setAccessToken(accessToken);
    if (refreshToken) {
      tokenService.setRefreshToken(refreshToken);
    }
  },

  /**
   * Clear all tokens from storage
   */
  clearTokens: () => {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
  },

  /**
   * Check if token exists
   * @returns {boolean}
   */
  hasToken: () => {
    return !!tokenService.getAccessToken();
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getUser: () => {
    try {
      const stored = localStorage.getItem(TOKEN_CONFIG.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set user data in storage
   * @param {Object} user
   */
  setUser: (user) => {
    localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(user));
  },

  /**
   * Clear user data from storage
   */
  clearUser: () => {
    localStorage.removeItem(TOKEN_CONFIG.USER_KEY);
  },

  /**
   * Clear all auth data from storage
   */
  clearAll: () => {
    tokenService.clearTokens();
    tokenService.clearUser();
    localStorage.removeItem(TOKEN_CONFIG.SELECTED_BRANCH_KEY);
  },

  /**
   * Get selected branch
   * @returns {Object|null}
   */
  getSelectedBranch: () => {
    try {
      const stored = localStorage.getItem(TOKEN_CONFIG.SELECTED_BRANCH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set selected branch
   * @param {Object} branch
   */
  setSelectedBranch: (branch) => {
    localStorage.setItem(TOKEN_CONFIG.SELECTED_BRANCH_KEY, JSON.stringify(branch));
  },
};

export default tokenService;
