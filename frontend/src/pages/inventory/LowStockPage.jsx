/**
 * Low Stock Page
 * Displays products that need reordering
 */

import { useState, useMemo } from "react";
import { Download, ShoppingCart } from "lucide-react";
import { useLowStockProducts, getLowStockColumns } from "@/features/inventory";
import { DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>
              Products below their reorder level • {outOfStockCount} out of
              stock
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
