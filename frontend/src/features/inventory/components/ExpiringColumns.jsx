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
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("productCode")}</span>
    ),
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("productName")}</div>
        {row.original.batchNumber && (
          <div className="text-sm text-muted-foreground">
            Batch: {row.original.batchNumber}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const expiryDate = row.getValue("expiryDate");
      if (!expiryDate) return "-";

      const expiry = parseISO(expiryDate);
      const daysUntilExpiry = differenceInDays(expiry, new Date());
      const isExpired = isPast(expiry);

      return (
        <div className="space-y-1">
          <div className={isExpired ? "text-red-600 font-medium" : ""}>
            {formatDate(expiryDate)}
          </div>
          <div className="text-sm">
            {isExpired ? (
              <span className="text-red-600">
                Expired {Math.abs(daysUntilExpiry)} days ago
              </span>
            ) : daysUntilExpiry <= 30 ? (
              <span className="text-orange-600">
                {daysUntilExpiry} days left
              </span>
            ) : daysUntilExpiry <= 90 ? (
              <span className="text-yellow-600">
                {daysUntilExpiry} days left
              </span>
            ) : (
              <span className="text-muted-foreground">
                {daysUntilExpiry} days left
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => row.getValue("quantity") || 0,
  },
  {
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("branchName") || "-"}</Badge>
    ),
  },
  {
    accessorKey: "sellingPrice",
    header: "Value",
    cell: ({ row }) => {
      const qty = row.original.quantity || 0;
      const price = row.original.sellingPrice || 0;
      return formatCurrency(qty * price);
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
        return <Badge variant="destructive">Expired</Badge>;
      }
      if (daysUntilExpiry <= 30) {
        return <Badge variant="destructive">Critical</Badge>;
      }
      if (daysUntilExpiry <= 90) {
        return <Badge variant="warning">Expiring Soon</Badge>;
      }
      return <Badge variant="secondary">OK</Badge>;
    },
  },
];

export default getExpiringColumns;
