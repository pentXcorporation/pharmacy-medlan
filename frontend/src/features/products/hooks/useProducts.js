/**
 * Products Feature - Hooks
 * React Query hooks for product management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productService } from "@/services";

// Query keys
export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
  search: (query) => [...productKeys.all, "search", query],
  lowStock: (branchId) => [...productKeys.all, "low-stock", branchId],
};

/**
 * Hook to fetch products list with pagination
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getAll(params),
    select: (response) => response.data.data, // ApiResponse.data contains PageResponse
  });
};

/**
 * Hook to fetch single product by ID
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    select: (response) => response.data.data, // ApiResponse.data contains ProductResponse
    enabled: !!id,
  });
};

/**
 * Hook to search products
 */
export const useProductSearch = (query, params = {}) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.search(query, params),
    select: (response) => response.data.data, // ApiResponse.data contains List<ProductResponse>
    enabled: !!query && query.length >= 2,
  });
};

/**
 * Hook to get low stock products
 */
export const useLowStockProducts = (branchId, params = {}) => {
  return useQuery({
    queryKey: productKeys.lowStock(branchId),
    queryFn: () => productService.getLowStock(branchId, params),
    select: (response) => response.data.data, // ApiResponse.data contains List<ProductResponse>
    enabled: !!branchId,
  });
};

/**
 * Hook to create product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

/**
 * Hook to update product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

/**
 * Hook to delete product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};

/**
 * Hook to discontinue product
 */
export const useDiscontinueProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productService.discontinue(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success("Product discontinued successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to discontinue product"
      );
    },
  });
};
