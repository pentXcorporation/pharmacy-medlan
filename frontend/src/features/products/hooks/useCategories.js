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
    select: (response) => {
      // Axios response: { data: { success, message, data: [...], timestamp } }
      const apiResponse = response.data;

      // Extract the actual data from ApiResponse wrapper
      const categories = apiResponse?.data;

      // Ensure we have an array and filter out soft-deleted categories
      const categoryList = Array.isArray(categories)
        ? categories.filter((cat) => !cat.deleted)
        : [];

      // Return in paginated format for DataTable compatibility
      return {
        content: categoryList,
        totalElements: categoryList.length,
        totalPages: 1,
      };
    },
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
      // Axios response: { data: { success, message, data: [...], timestamp } }
      const apiResponse = response.data;
      const categories = apiResponse?.data;

      // Return array of categories
      return Array.isArray(categories) ? categories : [];
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
      console.error("Create category error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create category";
      toast.error(message);
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
      console.error("Delete category error:", error);

      // Handle network errors
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
        return;
      }

      // Handle connection errors
      if (error.code === "ERR_CONNECTION_CLOSED" || !error.response) {
        toast.error(
          "Connection lost. Please ensure the backend server is running."
        );
        return;
      }

      // Handle server errors
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete category";
      toast.error(message);
    },
  });
};
