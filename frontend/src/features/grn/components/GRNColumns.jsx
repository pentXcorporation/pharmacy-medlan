/**
 * GRN Columns Definition
 * Defines the columns for the GRN DataTable
 */

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Undo2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";

// Status badge configuration
const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PENDING: { label: "Pending Verification", variant: "warning" },
  VERIFIED: { label: "Verified", variant: "default" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "secondary" },
};

/**
 * Get column definitions for GRN table
 */
export const getGRNColumns = ({
  onView,
  onVerify,
  onComplete,
  onCreateReturn,
} = {}) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "grnNumber",
    header: "GRN Number",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.getValue("grnNumber")}
      </span>
    ),
  },
  {
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => {
      const po = row.original.purchaseOrder;
      return po?.poNumber || row.getValue("poNumber") || "-";
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => {
      const supplier =
        row.original.supplier || row.original.purchaseOrder?.supplier;
      return supplier?.name || "-";
    },
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
    cell: ({ row }) => formatDate(row.getValue("receivedDate")),
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items || [];
      return items.length;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.getValue("totalAmount")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const config = statusConfig[status] || {
        label: status,
        variant: "secondary",
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const grn = row.original;
      const status = grn.status;

      const canVerify = status === "PENDING";
      const canComplete = status === "VERIFIED";
      const canReturn = status === "COMPLETED";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(grn)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {canVerify && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onVerify?.(grn)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </DropdownMenuItem>
              </>
            )}
            {canComplete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onComplete?.(grn)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete & Update Stock
                </DropdownMenuItem>
              </>
            )}
            {canReturn && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCreateReturn?.(grn)}>
                  <Undo2 className="mr-2 h-4 w-4" />
                  Create Return (RGRN)
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export default getGRNColumns;
