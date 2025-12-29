/**
 * Axios API Client Configuration
 * Handles authentication, interceptors, and error handling
 */
import axios from "axios";
import { API_CONFIG } from "@/config/api.config";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": API_CONFIG.HEADERS.CONTENT_TYPE,
    Accept: API_CONFIG.HEADERS.ACCEPT,
  },
});

// Create auth client for auth endpoints (different base URL)
export const authClient = axios.create({
  baseURL: API_CONFIG.AUTH_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": API_CONFIG.HEADERS.CONTENT_TYPE,
    Accept: API_CONFIG.HEADERS.ACCEPT,
  },
});

// Token management
const getAccessToken = () => localStorage.getItem(API_CONFIG.TOKEN.ACCESS_KEY);
const getRefreshToken = () =>
  localStorage.getItem(API_CONFIG.TOKEN.REFRESH_KEY);

// Request interceptor - Add auth token
const addAuthToken = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiClient.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);
authClient.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - Handle token refresh
const responseInterceptor = (response) => response;

const errorInterceptor = async (error) => {
  const originalRequest = error.config;

  // If error is 401 and we haven't retried yet
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // Queue the request while refreshing
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      // No refresh token, redirect to login
      isRefreshing = false;
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const response = await authClient.post("/auth/refresh", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      localStorage.setItem(API_CONFIG.TOKEN.ACCESS_KEY, accessToken);
      if (newRefreshToken) {
        localStorage.setItem(API_CONFIG.TOKEN.REFRESH_KEY, newRefreshToken);
      }

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear tokens and redirect to login
      localStorage.removeItem(API_CONFIG.TOKEN.ACCESS_KEY);
      localStorage.removeItem(API_CONFIG.TOKEN.REFRESH_KEY);
      localStorage.removeItem(API_CONFIG.TOKEN.USER_KEY);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // Handle other errors
  if (error.response?.status === 403) {
    // Forbidden - don't redirect, just reject with error
    // Let the component handle it via onError callback
    console.error("Forbidden (403):", error.response?.data);
  }

  // Handle 500 errors - log but don't redirect
  if (error.response?.status === 500) {
    console.error("Server Error (500):", error.response?.data);
  }

  return Promise.reject(error);
};

apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
authClient.interceptors.response.use(responseInterceptor, errorInterceptor);

// API helper methods
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

// Extract data from API response
export const extractData = (response) => response.data?.data || response.data;

// Extract error message from API error
export const extractErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export default apiClient;
