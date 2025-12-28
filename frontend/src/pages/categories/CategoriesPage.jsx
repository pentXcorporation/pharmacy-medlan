/**
 * Categories Page
 * Displays all categories with dialog-based CRUD
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
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
  const confirm = useConfirm();

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

  // Build query params
  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort:
        sorting.length > 0
          ? `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`
          : "categoryName,asc",
      ...(searchQuery && { search: searchQuery }),
    }),
    [pagination, sorting, searchQuery]
  );

  // Fetch categories
  const { data, isLoading, isFetching } = useCategories(queryParams);

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

  const handleDelete = useCallback(
    async (category) => {
      const confirmed = await confirm({
        title: "Delete Category",
        description: `Are you sure you want to delete "${category.categoryName}"? Products in this category will need to be reassigned.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
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
        onDelete: handleDelete,
      }),
    [handleView, handleEdit, handleDelete]
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
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
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
