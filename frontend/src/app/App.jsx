import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';

/**
 * Main Application Component
 * Wraps the entire application with necessary providers and routing
 */
function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
