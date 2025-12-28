/**
 * Products List Page
 * Displays all products with filtering, sorting, and pagination
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Upload } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useProducts,
  useDeleteProduct,
  useDiscontinueProduct,
  getProductColumns,
  ProductFilters,
} from "@/features/products";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/common/ConfirmDialog";

/**
 * ProductsPage component
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    categoryId: undefined,
    status: undefined,
  });

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
          : "productName,asc",
      ...(filters.search && { search: filters.search }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.status && { status: filters.status }),
    }),
    [pagination, sorting, filters]
  );

  // Fetch products
  const { data, isLoading, isFetching } = useProducts(queryParams);
  const deleteProduct = useDeleteProduct();
  const discontinueProduct = useDiscontinueProduct();

  // Handlers
  const handleView = useCallback(
    (product) => {
      navigate(ROUTES.PRODUCTS.VIEW(product.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (product) => {
      navigate(ROUTES.PRODUCTS.EDIT(product.id));
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (product) => {
      const confirmed = await confirm({
        title: "Delete Product",
        description: `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        deleteProduct.mutate(product.id);
      }
    },
    [confirm, deleteProduct]
  );

  const handleDiscontinue = useCallback(
    async (product) => {
      const confirmed = await confirm({
        title: "Discontinue Product",
        description: `Are you sure you want to discontinue "${product.productName}"? This will mark the product as no longer available for sale.`,
        confirmText: "Discontinue",
        cancelText: "Cancel",
        variant: "warning",
      });

      if (confirmed) {
        discontinueProduct.mutate(product.id);
      }
    },
    [confirm, discontinueProduct]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      categoryId: undefined,
      status: undefined,
    });
  }, []);

  // Get columns with handlers
  const columns = useMemo(
    () =>
      getProductColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onDiscontinue: handleDiscontinue,
      }),
    [handleView, handleEdit, handleDelete, handleDiscontinue]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate(ROUTES.PRODUCTS.NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
      />

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
    </div>
  );
};

export default ProductsPage;
