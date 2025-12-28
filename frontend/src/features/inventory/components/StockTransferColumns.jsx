/**
 * Stock Transfer Columns Definition
 * Defines the columns for the stock transfers DataTable
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  CheckCircle,
  XCircle,
  Truck,
  PackageCheck,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";
import {
  TRANSFER_STATUS,
  TRANSFER_STATUS_LABELS,
  TRANSFER_STATUS_COLORS,
} from "@/constants";

/**
 * Get column definitions for stock transfers table
 */
export const getStockTransferColumns = ({
  onView,
  onApprove,
  onReject,
  onDispatch,
  onReceive,
} = {}) => [
  {
    accessorKey: "transferNumber",
    header: "Transfer #",
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {row.getValue("transferNumber")}
      </span>
    ),
  },
  {
    accessorKey: "fromBranch",
    header: "From Branch",
    cell: ({ row }) => <div>{row.original.fromBranch?.branchName || "-"}</div>,
  },
  {
    accessorKey: "toBranch",
    header: "To Branch",
    cell: ({ row }) => <div>{row.original.toBranch?.branchName || "-"}</div>,
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.items?.length || 0} items</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const colorClass =
        TRANSFER_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
      return (
        <Badge className={colorClass}>
          {TRANSFER_STATUS_LABELS[status] || status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "requestedDate",
    header: "Requested",
    cell: ({ row }) => formatDate(row.getValue("requestedDate")),
  },
  {
    accessorKey: "createdBy",
    header: "Requested By",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.createdBy?.firstName} {row.original.createdBy?.lastName}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transfer = row.original;
      const status = transfer.status;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(transfer)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {status === TRANSFER_STATUS.PENDING && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onApprove?.(transfer)}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject?.(transfer)}>
                  <XCircle className="mr-2 h-4 w-4 text-red-600" />
                  Reject
                </DropdownMenuItem>
              </>
            )}

            {status === TRANSFER_STATUS.APPROVED && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDispatch?.(transfer)}>
                  <Truck className="mr-2 h-4 w-4" />
                  Mark as Dispatched
                </DropdownMenuItem>
              </>
            )}

            {status === TRANSFER_STATUS.DISPATCHED && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onReceive?.(transfer)}>
                  <PackageCheck className="mr-2 h-4 w-4" />
                  Receive
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

export default getStockTransferColumns;
