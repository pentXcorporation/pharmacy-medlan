/**
 * API Hooks
 * React Query hooks for API operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/utils";
import { toast } from "sonner";

/**
 * Default query options
 */
const defaultOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 1,
  refetchOnWindowFocus: false,
};

/**
 * Generic GET hook
 * @param {string|Array} queryKey - Query key for caching
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options
 * @returns {Object} Query result
 */
export const useApiQuery = (queryKey, url, options = {}) => {
  const { params, enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      const response = await api.get(url, { params });
      return response.data;
    },
    enabled,
    ...defaultOptions,
    ...queryOptions,
  });
};

/**
 * Generic POST/PUT/DELETE mutation hook
 * @param {string} mutationKey - Mutation key
 * @param {Function} mutationFn - Mutation function
 * @param {Object} options - Additional options
 * @returns {Object} Mutation result
 */
export const useApiMutation = (mutationKey, mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  const {
    invalidateQueries = [],
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    ...mutationOptions
  } = options;

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(key) ? key : [key],
        });
      });

      // Show success toast
      if (successMessage) {
        toast.success(successMessage);
      }

      // Call custom onSuccess
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Show error toast
      const message =
        errorMessage ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred";
      toast.error(message);

      // Call custom onError
      onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
};

/**
 * Create mutation hook factory
 * @param {string} endpoint - API endpoint
 * @returns {Function} useMutation hook
 */
export const useCreate = (endpoint, options = {}) => {
  return useApiMutation(
    `create-${endpoint}`,
    (data) => api.post(endpoint, data),
    {
      successMessage: "Created successfully",
      ...options,
    }
  );
};

/**
 * Update mutation hook factory
 * @param {string} endpoint - API endpoint (with :id placeholder)
 * @returns {Function} useMutation hook
 */
export const useUpdate = (endpoint, options = {}) => {
  return useApiMutation(
    `update-${endpoint}`,
    ({ id, data }) => api.put(endpoint.replace(":id", id), data),
    {
      successMessage: "Updated successfully",
      ...options,
    }
  );
};

/**
 * Delete mutation hook factory
 * @param {string} endpoint - API endpoint (with :id placeholder)
 * @returns {Function} useMutation hook
 */
export const useDelete = (endpoint, options = {}) => {
  return useApiMutation(
    `delete-${endpoint}`,
    (id) => api.delete(endpoint.replace(":id", id)),
    {
      successMessage: "Deleted successfully",
      ...options,
    }
  );
};

/**
 * Paginated query hook
 * @param {string} queryKey - Query key
 * @param {string} url - API endpoint
 * @param {Object} options - Query options including pagination params
 * @returns {Object} Query result with pagination helpers
 */
export const usePaginatedQuery = (queryKey, url, options = {}) => {
  const { page = 0, size = 10, sort, filters = {}, ...queryOptions } = options;

  const params = {
    page,
    size,
    ...(sort && { sort }),
    ...filters,
  };

  const query = useApiQuery([queryKey, page, size, sort, filters], url, {
    params,
    keepPreviousData: true,
    ...queryOptions,
  });

  return {
    ...query,
    // Pagination helpers
    pagination: query.data
      ? {
          page: query.data.number ?? page,
          size: query.data.size ?? size,
          totalElements: query.data.totalElements ?? 0,
          totalPages: query.data.totalPages ?? 0,
          isFirst: query.data.first ?? page === 0,
          isLast: query.data.last ?? true,
          hasNext: !query.data.last,
          hasPrevious: !query.data.first,
        }
      : null,
    items: query.data?.content ?? [],
  };
};

/**
 * Infinite scroll query hook
 * @param {string} queryKey - Query key
 * @param {string} url - API endpoint
 * @param {Object} options - Query options
 * @returns {Object} Infinite query result
 */
export const useInfiniteApiQuery = (queryKey, url, options = {}) => {
  const { size = 20, ...queryOptions } = options;

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(url, {
        params: { page: pageParam, size },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
    ...defaultOptions,
    ...queryOptions,
  });
};

/**
 * Prefetch query helper
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  return (queryKey, url, options = {}) => {
    queryClient.prefetchQuery({
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      queryFn: async () => {
        const response = await api.get(url, { params: options.params });
        return response.data;
      },
      ...defaultOptions,
    });
  };
};

export default {
  useApiQuery,
  useApiMutation,
  useCreate,
  useUpdate,
  useDelete,
  usePaginatedQuery,
  useInfiniteApiQuery,
  usePrefetch,
};
