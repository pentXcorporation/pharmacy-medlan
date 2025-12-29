/**
 * Low Stock Table Component
 * Displays products with low stock levels
 */

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";

/**
 * Get column definitions for low stock products table
 */
export const getLowStockColumns = () => [
  {
    accessorKey: "productCode",
    header: "Code",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("productCode")}</span>
    ),
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <div className="max-w-[120px] sm:max-w-none">
        <div className="font-medium text-sm truncate">
          {row.getValue("productName")}
        </div>
        {row.original.genericName && (
          <div className="text-xs text-muted-foreground truncate hidden sm:block">
            {row.original.genericName}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "currentStock",
    header: "Stock",
    cell: ({ row }) => {
      const current = row.getValue("currentStock") || 0;
      const reorder = row.original.reorderLevel || 0;
      const percentage =
        reorder > 0 ? Math.min((current / reorder) * 100, 100) : 100;

      return (
        <div className="space-y-1 min-w-[80px] sm:min-w-[120px]">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className={current === 0 ? "text-red-600 font-medium" : ""}>
              {current}
            </span>
            <span className="text-muted-foreground">/ {reorder}</span>
          </div>
          <Progress
            value={percentage}
            className="h-2"
            indicatorClassName={
              current === 0
                ? "bg-red-500"
                : percentage < 50
                ? "bg-orange-500"
                : "bg-yellow-500"
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: "branchName",
    header: "Branch",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("branchName") || "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.category?.categoryName || "-"}
      </div>
    ),
  },
  {
    accessorKey: "sellingPrice",
    header: "Price",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => (
      <span className="text-sm">
        {formatCurrency(row.getValue("sellingPrice"))}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const current = row.original.currentStock || 0;

      if (current === 0) {
        return (
          <Badge variant="destructive" className="text-xs">
            Out
          </Badge>
        );
      }
      return (
        <Badge variant="warning" className="text-xs">
          Low
        </Badge>
      );
    },
  },
];

export default getLowStockColumns;
