/**
 * Debounce Hooks
 * Provides debouncing utilities for inputs and callbacks
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook that debounces a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook that returns a debounced callback function
 * @param {Function} callback - Callback to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @param {Array} dependencies - Dependencies for the callback
 * @returns {Function} Debounced callback
 */
export const useDebouncedCallback = (callback, delay = 300, dependencies = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook for debounced search input
 * @param {string} initialValue - Initial search value
 * @param {number} delay - Debounce delay (default: 300ms)
 * @returns {Object} Search state and handlers
 */
export const useDebouncedSearch = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm: handleSearch,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
};

/**
 * Hook that throttles a value (fires at most once per interval)
 * @param {any} value - Value to throttle
 * @param {number} interval - Throttle interval in milliseconds
 * @returns {any} Throttled value
 */
export const useThrottle = (value, interval = 300) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecuted.current;

    if (elapsed >= interval) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};

export default useDebounce;
