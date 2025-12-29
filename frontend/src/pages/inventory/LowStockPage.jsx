/**
 * Low Stock Page
 * Displays products that need reordering
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ShoppingCart } from "lucide-react";
import { useLowStockProducts, getLowStockColumns } from "@/features/inventory";
import { DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * LowStockPage component
 */
const LowStockPage = () => {
  const navigate = useNavigate();

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
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
          : "currentStock,asc",
    }),
    [pagination, sorting]
  );

  // Fetch low stock products
  const { data, isLoading, isFetching } = useLowStockProducts(queryParams);

  // Get columns
  const columns = useMemo(() => getLowStockColumns(), []);

  // Calculate out of stock count
  const outOfStockCount =
    data?.content?.filter((p) => p.currentStock === 0).length || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Low Stock Products
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Products below reorder level • {outOfStockCount} out of stock
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => navigate(ROUTES.PURCHASE_ORDERS.NEW)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create PO</span>
              <span className="sm:hidden">New PO</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default LowStockPage;
