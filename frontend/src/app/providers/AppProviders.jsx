import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

/**
 * AppProviders Component
 * Wraps the application with all necessary global providers
 * Order matters - outer providers are available to inner ones
 */
export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default AppProviders;
