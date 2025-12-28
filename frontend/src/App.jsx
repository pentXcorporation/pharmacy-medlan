/**
 * App Component
 * Root application component with all providers
 */

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary, GlobalConfirmDialog } from "@/components/common";
import { useAuthStore, useUiStore } from "@/store";
import router from "@/routes";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Theme Provider - applies theme class to document
 */
const ThemeProvider = ({ children }) => {
  const { theme } = useUiStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return children;
};

/**
 * Auth Initializer - restores auth state on app load
 */
const AuthInitializer = ({ children }) => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
};

/**
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthInitializer>
            <TooltipProvider>
              <RouterProvider router={router} />

              {/* Global Toaster */}
              <Toaster
                position="top-right"
                expand={false}
                richColors
                closeButton
              />

              {/* Global Confirm Dialog */}
              <GlobalConfirmDialog />
            </TooltipProvider>
          </AuthInitializer>
        </ThemeProvider>

        {/* React Query Devtools (dev only) */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
