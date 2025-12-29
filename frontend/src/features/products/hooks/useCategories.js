/**
 * Categories Feature - Hooks
 * React Query hooks for category management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryService } from "@/services";

// Query keys
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  active: () => [...categoryKeys.all, "active"],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.getAll(),
    select: (response) => response.data,
  });
};

/**
 * Hook to fetch active categories
 */
export const useActiveCategories = () => {
  return useQuery({
    queryKey: categoryKeys.active(),
    queryFn: () => categoryService.getActive(),
    select: (response) => {
      // Handle both array and paginated response formats
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      // If paginated, return the content array
      if (data && Array.isArray(data.content)) {
        return data.content;
      }
      // Fallback to empty array
      return [];
    },
  });
};

/**
 * Hook to fetch single category by ID
 */
export const useCategory = (id) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

/**
 * Hook to create category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

/**
 * Hook to update category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

/**
 * Hook to delete category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};
