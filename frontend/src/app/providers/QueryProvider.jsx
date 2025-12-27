import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * Configure QueryClient with default options
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch on window focus is disabled for better UX
      refetchOnWindowFocus: false,
      // Retry failed queries once
      retry: 1,
      // Stale time before refetching (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time (30 minutes)
      gcTime: 30 * 60 * 1000,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * QueryProvider Component
 * Provides React Query client to the application
 */
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export { queryClient };
export default QueryProvider;
