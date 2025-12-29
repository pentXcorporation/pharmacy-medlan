/**
 * Expiring Products Table Component
 * Displays products approaching expiry or already expired
 */

import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { differenceInDays, isPast, parseISO } from "date-fns";

/**
 * Get column definitions for expiring products table
 */
export const getExpiringColumns = () => [
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
        {row.original.batchNumber && (
          <div className="text-xs text-muted-foreground truncate hidden sm:block">
            Batch: {row.original.batchNumber}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry",
    cell: ({ row }) => {
      const expiryDate = row.getValue("expiryDate");
      if (!expiryDate) return "-";

      const expiry = parseISO(expiryDate);
      const daysUntilExpiry = differenceInDays(expiry, new Date());
      const isExpired = isPast(expiry);

      return (
        <div className="space-y-0.5 sm:space-y-1">
          <div
            className={`text-xs sm:text-sm ${
              isExpired ? "text-red-600 font-medium" : ""
            }`}
          >
            {formatDate(expiryDate)}
          </div>
          <div className="text-xs hidden sm:block">
            {isExpired ? (
              <span className="text-red-600">
                Expired {Math.abs(daysUntilExpiry)}d ago
              </span>
            ) : daysUntilExpiry <= 30 ? (
              <span className="text-orange-600">{daysUntilExpiry}d left</span>
            ) : daysUntilExpiry <= 90 ? (
              <span className="text-yellow-600">{daysUntilExpiry}d left</span>
            ) : (
              <span className="text-muted-foreground">
                {daysUntilExpiry}d left
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("quantity") || 0}</span>
    ),
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
    accessorKey: "sellingPrice",
    header: "Value",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => {
      const qty = row.original.quantity || 0;
      const price = row.original.sellingPrice || 0;
      return <span className="text-sm">{formatCurrency(qty * price)}</span>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const expiryDate = row.original.expiryDate;
      if (!expiryDate) return "-";

      const expiry = parseISO(expiryDate);
      const daysUntilExpiry = differenceInDays(expiry, new Date());
      const isExpired = isPast(expiry);

      if (isExpired) {
        return (
          <Badge variant="destructive" className="text-xs">
            Expired
          </Badge>
        );
      }
      if (daysUntilExpiry <= 30) {
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        );
      }
      if (daysUntilExpiry <= 90) {
        return (
          <Badge variant="warning" className="text-xs">
            Soon
          </Badge>
        );
      }
      return (
        <Badge variant="secondary" className="text-xs">
          OK
        </Badge>
      );
    },
  },
];

export default getExpiringColumns;
