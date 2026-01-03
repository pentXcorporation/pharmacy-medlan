/**
 * UI Store - Zustand store for UI state
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  theme: "system",
  preferences: {
    themeMode: "system",
    colorTheme: "blue",
    dateFormat: "DD/MM/YYYY",
    currency: "LKR",
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    screenReader: false,
    keyboardNav: "standard",
    tablePageSize: "10",
    compactTables: false,
  },
  confirmDialog: {
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default",
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
        // Also update preferences.themeMode
        set((state) => ({
          preferences: { ...state.preferences, themeMode: theme }
        }));
        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          root.classList.add(systemTheme);
        } else if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.add("light");
        }
      },

      // Update preference
      updatePreference: (key, value) => {
        set((state) => ({
          preferences: { ...state.preferences, [key]: value }
        }));
        
        // If updating themeMode, also update theme
        if (key === "themeMode") {
          const { setTheme } = get();
          setTheme(value);
          return; // setTheme already handles application
        }
        
        // Apply other preferences immediately
        const root = document.documentElement;
        
        // Apply color theme
        if (key === "colorTheme") {
          root.setAttribute("data-theme", value);
        }
        
        // Apply accessibility settings
        if (key === "highContrast") root.classList.toggle("high-contrast", value);
        if (key === "reduceMotion") root.classList.toggle("reduce-motion", value);
        if (key === "largeText") root.classList.toggle("large-text", value);
        if (key === "screenReader") root.classList.toggle("screen-reader", value);
        if (key === "keyboardNav") root.setAttribute("data-keyboard-nav", value);
        if (key === "compactTables") root.classList.toggle("compact-tables", value);
      },

      // Toggle theme
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },

      // Show confirm dialog
      showConfirmDialog: ({
        title,
        message,
        onConfirm,
        onCancel,
        confirmText = "Confirm",
        cancelText = "Cancel",
        variant = "default",
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
      name: "ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
