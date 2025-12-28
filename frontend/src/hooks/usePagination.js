/**
 * Pagination Hook
 * Provides pagination state and utilities
 */

import { useState, useCallback, useMemo } from 'react';
import { APP_CONFIG } from '@/config';

/**
 * Hook for managing pagination state
 * @param {Object} options - Pagination options
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (options = {}) => {
  const {
    initialPage = 0,
    initialSize = APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
    totalElements = 0,
    totalPages = 0,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Go to specific page
   * @param {number} pageNumber - Page number (0-indexed)
   */
  const goToPage = useCallback((pageNumber) => {
    const validPage = Math.max(0, Math.min(pageNumber, Math.max(0, totalPages - 1)));
    setPage(validPage);
  }, [totalPages]);

  /**
   * Go to first page
   */
  const firstPage = useCallback(() => {
    setPage(0);
  }, []);

  /**
   * Go to last page
   */
  const lastPage = useCallback(() => {
    setPage(Math.max(0, totalPages - 1));
  }, [totalPages]);

  /**
   * Change page size
   * @param {number} newSize - New page size
   */
  const changeSize = useCallback((newSize) => {
    setSize(newSize);
    setPage(0); // Reset to first page when size changes
  }, []);

  /**
   * Reset pagination to initial state
   */
  const reset = useCallback(() => {
    setPage(initialPage);
    setSize(initialSize);
  }, [initialPage, initialSize]);

  /**
   * Pagination state for API requests
   */
  const paginationParams = useMemo(() => ({
    page,
    size,
  }), [page, size]);

  /**
   * Display information
   */
  const displayInfo = useMemo(() => {
    const start = page * size + 1;
    const end = Math.min((page + 1) * size, totalElements);
    
    return {
      start: totalElements > 0 ? start : 0,
      end,
      total: totalElements,
      text: totalElements > 0 
        ? `Showing ${start} to ${end} of ${totalElements} entries`
        : 'No entries to show',
    };
  }, [page, size, totalElements]);

  /**
   * Flags for navigation
   */
  const flags = useMemo(() => ({
    canPreviousPage: page > 0,
    canNextPage: page < totalPages - 1,
    isFirstPage: page === 0,
    isLastPage: page >= totalPages - 1,
    hasPages: totalPages > 0,
    hasMultiplePages: totalPages > 1,
  }), [page, totalPages]);

  /**
   * Page numbers for pagination UI
   */
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(0, page - halfVisible);
    let endPage = Math.min(totalPages - 1, page + halfVisible);
    
    // Adjust if at the beginning or end
    if (page < halfVisible) {
      endPage = Math.min(totalPages - 1, maxVisible - 1);
    }
    if (page > totalPages - halfVisible - 1) {
      startPage = Math.max(0, totalPages - maxVisible);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [page, totalPages]);

  return {
    // State
    page,
    size,
    totalElements,
    totalPages,
    
    // Navigation
    nextPage,
    previousPage,
    goToPage,
    firstPage,
    lastPage,
    
    // Size
    changeSize,
    pageSizeOptions: APP_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS,
    
    // Reset
    reset,
    
    // API params
    paginationParams,
    
    // Display
    displayInfo,
    pageNumbers,
    
    // Flags
    ...flags,
  };
};

/**
 * Hook for managing sorting state
 * @param {Object} options - Sorting options
 * @returns {Object} Sorting state and handlers
 */
export const useSorting = (options = {}) => {
  const {
    initialSortField = '',
    initialSortDirection = 'asc',
  } = options;

  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  /**
   * Handle sort change
   * @param {string} field - Field to sort by
   */
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New field, reset to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  /**
   * Set sort explicitly
   * @param {string} field - Field to sort by
   * @param {string} direction - Sort direction ('asc' or 'desc')
   */
  const setSort = useCallback((field, direction = 'asc') => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  /**
   * Clear sorting
   */
  const clearSort = useCallback(() => {
    setSortField('');
    setSortDirection('asc');
  }, []);

  /**
   * Sort params for API requests
   */
  const sortParams = useMemo(() => {
    if (!sortField) return {};
    return {
      sort: `${sortField},${sortDirection}`,
    };
  }, [sortField, sortDirection]);

  /**
   * Get sort indicator for a field
   * @param {string} field - Field name
   * @returns {string|null} Sort indicator ('asc', 'desc', or null)
   */
  const getSortIndicator = useCallback((field) => {
    if (sortField !== field) return null;
    return sortDirection;
  }, [sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    setSort,
    clearSort,
    sortParams,
    getSortIndicator,
    isSorted: !!sortField,
  };
};

/**
 * Combined hook for pagination and sorting
 * @param {Object} options - Options for both pagination and sorting
 * @returns {Object} Combined pagination and sorting state
 */
export const useTableState = (options = {}) => {
  const pagination = usePagination(options);
  const sorting = useSorting(options);

  /**
   * Combined params for API requests
   */
  const tableParams = useMemo(() => ({
    ...pagination.paginationParams,
    ...sorting.sortParams,
  }), [pagination.paginationParams, sorting.sortParams]);

  /**
   * Reset both pagination and sorting
   */
  const resetAll = useCallback(() => {
    pagination.reset();
    sorting.clearSort();
  }, [pagination.reset, sorting.clearSort]);

  return {
    ...pagination,
    ...sorting,
    tableParams,
    resetAll,
  };
};

export default usePagination;
