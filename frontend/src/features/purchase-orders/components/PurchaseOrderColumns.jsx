/**
 * Purchase Order Columns Definition
 * Defines the columns for the purchase orders DataTable
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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";

// Status badge configuration
const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PENDING: { label: "Pending", variant: "warning" },
  APPROVED: { label: "Approved", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  ORDERED: { label: "Ordered", variant: "outline" },
  PARTIALLY_RECEIVED: { label: "Partial", variant: "warning" },
  RECEIVED: { label: "Received", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "secondary" },
};

/**
 * Get column definitions for purchase orders table
 */
export const getPurchaseOrderColumns = ({
  onView,
  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
  onReceive,
  currentUserRole,
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
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.getValue("poNumber")}
      </span>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return supplier?.name || "-";
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => formatDate(row.getValue("orderDate")),
  },
  {
    accessorKey: "expectedDate",
    header: "Expected",
    cell: ({ row }) => formatDate(row.getValue("expectedDate")) || "-",
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
      const po = row.original;
      const status = po.status;

      const canEdit = status === "DRAFT";
      const canSubmit = status === "DRAFT";
      const canApprove = status === "PENDING";
      const canReceive = status === "APPROVED" || status === "ORDERED";
      const canDelete = status === "DRAFT";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(po)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit?.(po)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {canSubmit && (
              <DropdownMenuItem onClick={() => onSubmit?.(po)}>
                <Send className="mr-2 h-4 w-4" />
                Submit for Approval
              </DropdownMenuItem>
            )}
            {canApprove && (
              <>
                <DropdownMenuItem onClick={() => onApprove?.(po)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject?.(po)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {canReceive && (
              <DropdownMenuItem onClick={() => onReceive?.(po)}>
                <Package className="mr-2 h-4 w-4" />
                Receive (Create GRN)
              </DropdownMenuItem>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(po)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
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

export default getPurchaseOrderColumns;
