/**
 * Categories Feature Barrel Export
 */

// Re-export hooks from products (categories are managed there)
export {
  useCategories,
  useActiveCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  categoryKeys,
} from "@/features/products/hooks/useCategories";

// Export components
export * from "./components";
