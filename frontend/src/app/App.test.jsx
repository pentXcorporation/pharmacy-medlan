import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the providers and routes
vi.mock('./providers', () => ({
  AppProviders: ({ children }) => <div data-testid="app-providers">{children}</div>,
}));

vi.mock('./routes', () => ({
  AppRoutes: () => <div data-testid="app-routes">Routes</div>,
}));

vi.mock('sonner', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-providers')).toBeInTheDocument();
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });
});
