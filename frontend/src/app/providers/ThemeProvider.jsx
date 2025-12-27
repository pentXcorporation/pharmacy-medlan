import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context
 */
const ThemeContext = createContext(null);

/**
 * Available themes
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

const STORAGE_KEY = 'pharmacy-theme';

/**
 * Get stored theme from localStorage
 */
const getStoredTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  try {
    return localStorage.getItem(STORAGE_KEY) || THEMES.SYSTEM;
  } catch {
    return THEMES.SYSTEM;
  }
};

/**
 * Get system theme preference
 */
const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? THEMES.DARK 
    : THEMES.LIGHT;
};

/**
 * ThemeProvider Component
 * Manages theme state and applies theme to document
 */
export function ThemeProvider({ children, defaultTheme = THEMES.SYSTEM, storageKey = STORAGE_KEY }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return getStoredTheme() || defaultTheme;
  });

  const resolvedTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = (newTheme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
    setThemeState(newTheme);
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    const newTheme = resolvedTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    // Add new theme class
    const actualTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
    root.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', actualTheme === THEMES.DARK ? '#0a0a0a' : '#ffffff');
    }
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove(THEMES.LIGHT, THEMES.DARK);
      root.classList.add(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    themes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
