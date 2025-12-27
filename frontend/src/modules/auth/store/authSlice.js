import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenService } from '../services/tokenService';

/**
 * Auth Store using Zustand
 * Manages authentication state with persistence
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      selectedBranch: null,

      // Actions
      /**
       * Login user and store credentials
       */
      login: (userData, accessToken) => {
        tokenService.setAccessToken(accessToken);
        tokenService.setUser(userData);
        
        set({
          user: userData,
          token: accessToken,
          isAuthenticated: true,
          error: null,
        });
      },

      /**
       * Logout user and clear credentials
       */
      logout: () => {
        tokenService.clearAll();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedBranch: null,
          error: null,
        });
      },

      /**
       * Update user data
       */
      updateUser: (userData) => {
        tokenService.setUser(userData);
        set({ user: userData });
      },

      /**
       * Set selected branch
       */
      setSelectedBranch: (branch) => {
        tokenService.setSelectedBranch(branch);
        set({ selectedBranch: branch });
      },

      /**
       * Set loading state
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Set error state
       */
      setError: (error) => set({ error }),

      /**
       * Clear error state
       */
      clearError: () => set({ error: null }),

      /**
       * Check if user has specific role
       */
      hasRole: (role) => {
        const { user } = get();
        if (!user?.role) return false;
        if (Array.isArray(role)) {
          return role.includes(user.role);
        }
        return user.role === role;
      },

      /**
       * Initialize auth state from storage
       */
      initializeFromStorage: () => {
        const token = tokenService.getAccessToken();
        const user = tokenService.getUser();
        const selectedBranch = tokenService.getSelectedBranch();

        if (token && user) {
          set({
            user,
            token,
            isAuthenticated: true,
            selectedBranch,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);

export default useAuthStore;
