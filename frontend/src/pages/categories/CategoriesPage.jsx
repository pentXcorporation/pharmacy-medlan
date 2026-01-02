/**
 * Categories Page
 * Displays all categories with dialog-based CRUD
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  getCategoryColumns,
  CategoryFormDialog,
} from "@/features/categories";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/common/ConfirmDialog";

/**
 * CategoriesPage component
 */
const CategoriesPage = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Fetch categories (no query params - we'll filter client-side)
  const { data: apiData, isLoading, isFetching } = useCategories();

  // Filter categories based on search query and exclude deleted items
  const data = useMemo(() => {
    if (!apiData?.content) return apiData;

    // First, filter out deleted/inactive categories
    const activeCategories = apiData.content.filter(
      (category) => category.isActive !== false
    );

    // Then apply search filter if there's a search query
    if (!searchQuery.trim()) {
      return {
        ...apiData,
        content: activeCategories,
        totalElements: activeCategories.length,
        totalPages: Math.ceil(activeCategories.length / pagination.pageSize),
      };
    }

    const query = searchQuery.toLowerCase().trim();
    const filteredContent = activeCategories.filter((category) => {
      return (
        category.categoryName?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.categoryCode?.toLowerCase().includes(query)
      );
    });

    return {
      ...apiData,
      content: filteredContent,
      totalElements: filteredContent.length,
      totalPages: Math.ceil(filteredContent.length / pagination.pageSize),
    };
  }, [apiData, searchQuery, pagination.pageSize]);

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Handlers
  const handleAdd = useCallback(() => {
    setSelectedCategory(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  }, []);

  const handleView = useCallback(
    (category) => {
      // Navigate to products filtered by category
      navigate(`${ROUTES.PRODUCTS.LIST}?categoryId=${category.id}`);
    },
    [navigate]
  );

  const handleToggleStatus = useCallback(
    async (category) => {
      const isActivating = !category.isActive;
      const confirmed = await confirm({
        title: isActivating ? "Activate Category?" : "Deactivate Category?",
        description: isActivating
          ? `"${category.categoryName}" will be visible and available for use.`
          : `"${category.categoryName}" will be hidden from active lists. Products in this category will remain unchanged.`,
        confirmText: isActivating ? "Yes, Activate" : "Yes, Deactivate",
        cancelText: "Cancel",
        variant: "warning",
      });

      if (confirmed) {
        updateCategory.mutate({
          id: category.id,
          data: { 
            categoryName: category.categoryName, 
            description: category.description,
            isActive: isActivating
          },
        });
      }
    },
    [confirm, updateCategory]
  );

  const handleDelete = useCallback(
    async (category) => {
      const productCount = category.productCount || 0;
      const confirmed = await confirm({
        title: "Delete Category?",
        description:
          productCount > 0
            ? `"${category.categoryName}" has ${productCount} product${
                productCount > 1 ? "s" : ""
              }. These products will need to be reassigned. This action cannot be undone.`
            : `Are you sure you want to delete "${category.categoryName}"? This action cannot be undone.`,
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
        variant: "danger",
      });

      if (confirmed) {
        deleteCategory.mutate(category.id);
      }
    },
    [confirm, deleteCategory]
  );

  const handleSubmit = useCallback(
    (data) => {
      if (selectedCategory) {
        updateCategory.mutate(
          { id: selectedCategory.id, data },
          { onSuccess: () => setDialogOpen(false) }
        );
      } else {
        createCategory.mutate(data, {
          onSuccess: () => setDialogOpen(false),
        });
      }
    },
    [selectedCategory, createCategory, updateCategory]
  );

  // Get columns with handlers
  const columns = useMemo(
    () =>
      getCategoryColumns({
        onView: handleView,
        onEdit: handleEdit,
        onToggleStatus: handleToggleStatus,
        onDelete: handleDelete,
      }),
    [handleView, handleEdit, handleToggleStatus, handleDelete]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search categories by name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchQuery("")}
            >
              <span className="sr-only">Clear search</span>×
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.content || []}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          pageCount: data?.totalPages || 0,
          total: data?.totalElements || 0,
        }}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      {/* Form Dialog */}
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
      />
    </div>
  );
};

export default CategoriesPage;
