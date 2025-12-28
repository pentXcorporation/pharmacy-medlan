/**
 * UI Store - Zustand store for UI state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  theme: 'light',
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'default',
  },
};

export const useUiStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Toggle sidebar collapsed state
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      // Set sidebar collapsed state
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      // Toggle mobile sidebar
      toggleMobileSidebar: () => {
        set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen }));
      },

      // Set mobile sidebar open state
      setMobileSidebarOpen: (open) => {
        set({ sidebarMobileOpen: open });
      },

      // Set theme
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Toggle theme
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Show confirm dialog
      showConfirmDialog: ({
        title,
        message,
        onConfirm,
        onCancel,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        variant = 'default',
      }) => {
        set({
          confirmDialog: {
            open: true,
            title,
            message,
            onConfirm,
            onCancel,
            confirmText,
            cancelText,
            variant,
          },
        });
      },

      // Hide confirm dialog
      hideConfirmDialog: () => {
        set({
          confirmDialog: {
            ...initialState.confirmDialog,
            open: false,
          },
        });
      },

      // Handle confirm dialog confirm action
      handleConfirmDialogConfirm: () => {
        const { confirmDialog } = get();
        if (confirmDialog.onConfirm) {
          confirmDialog.onConfirm();
        }
        get().hideConfirmDialog();
      },

      // Handle confirm dialog cancel action
      handleConfirmDialogCancel: () => {
        const { confirmDialog } = get();
        if (confirmDialog.onCancel) {
          confirmDialog.onCancel();
        }
        get().hideConfirmDialog();
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
