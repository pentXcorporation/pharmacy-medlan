import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context
 */
const ThemeContext = createContext(null);

/**
 * Available themes
 */
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Get stored theme from localStorage
 */
const getStoredTheme = () => {
  try {
    return localStorage.getItem('theme') || THEMES.LIGHT;
  } catch {
    return THEMES.LIGHT;
  }
};

/**
 * Get system theme preference
 */
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  }
  return THEMES.LIGHT;
};

/**
 * ThemeProvider Component
 * Manages theme state and applies theme to document
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(
    theme === THEMES.SYSTEM ? getSystemTheme() : theme
  );

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
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
    const actualTheme = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
    setResolvedTheme(actualTheme);
    
    const root = document.documentElement;
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    root.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setResolvedTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
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
