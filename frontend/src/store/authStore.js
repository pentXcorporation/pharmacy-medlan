/**
 * Auth Store - Zustand store for authentication state
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_CONFIG } from "@/config/api.config";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      isLoading: false, // Set to false by default - will be updated after hydration

      // Set user after login - accepts object { user, accessToken, refreshToken }
      setAuth: ({ user, accessToken, refreshToken }) => {
        // Store tokens in localStorage for API client
        localStorage.setItem(API_CONFIG.TOKEN.ACCESS_KEY, accessToken);
        localStorage.setItem(API_CONFIG.TOKEN.REFRESH_KEY, refreshToken);
        localStorage.setItem(API_CONFIG.TOKEN.USER_KEY, JSON.stringify(user));

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      // Update user data
      setUser: (user) => {
        set({ user });
      },

      // Update tokens
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      // Set loading state
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Set error
      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Clear auth state (logout)
      clearAuth: () => {
        // Clear localStorage tokens
        localStorage.removeItem(API_CONFIG.TOKEN.ACCESS_KEY);
        localStorage.removeItem(API_CONFIG.TOKEN.REFRESH_KEY);
        localStorage.removeItem(API_CONFIG.TOKEN.USER_KEY);

        set({
          ...initialState,
          isLoading: false,
        });
      },

      // Check if user has a specific role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },

      // Get user's role
      getRole: () => {
        const { user } = get();
        return user?.role;
      },

      // Get user's branch ID
      getBranchId: () => {
        const { user } = get();
        return user?.branchId;
      },

      // Initialize auth from storage
      initializeAuth: () => {
        const token = localStorage.getItem(API_CONFIG.TOKEN.ACCESS_KEY);
        const userStr = localStorage.getItem(API_CONFIG.TOKEN.USER_KEY);

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              accessToken: token,
              refreshToken: localStorage.getItem(API_CONFIG.TOKEN.REFRESH_KEY),
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            set({ ...initialState, isLoading: false });
          }
        } else {
          set({ ...initialState, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        // When hydration completes, set isLoading to false
        if (error) {
          console.error("Failed to rehydrate auth store:", error);
        }

        // Always set isLoading to false after hydration, whether state exists or not
        if (state) {
          state.isLoading = false;
          // Also sync tokens to localStorage for the API client
          if (state.accessToken) {
            localStorage.setItem(
              API_CONFIG.TOKEN.ACCESS_KEY,
              state.accessToken
            );
          }
          if (state.refreshToken) {
            localStorage.setItem(
              API_CONFIG.TOKEN.REFRESH_KEY,
              state.refreshToken
            );
          }
          if (state.user) {
            localStorage.setItem(
              API_CONFIG.TOKEN.USER_KEY,
              JSON.stringify(state.user)
            );
          }
        }
      },
    }
  )
);
