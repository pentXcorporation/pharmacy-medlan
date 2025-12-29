/**
 * Credit Account Columns Definition
 * Defines the columns for the credit accounts DataTable
 */

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

/**
 * Get column definitions for credit accounts table
 */
export const getCreditAccountColumns = ({ onView, onManageCredit } = {}) => [
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
    accessorKey: "customerCode",
    header: "Code",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("customerCode")}</span>
    ),
  },
  {
    id: "name",
    header: "Customer Name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">
          {row.original.firstName} {row.original.lastName}
        </div>
        {row.original.email && (
          <div className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-none">
            {row.original.email}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.getValue("phone") || "-",
  },
  {
    accessorKey: "creditLimit",
    header: "Credit Limit",
    cell: ({ row }) => {
      const creditLimit = row.getValue("creditLimit");
      return (
        <span className="font-medium">{formatCurrency(creditLimit || 0)}</span>
      );
    },
  },
  {
    accessorKey: "currentBalance",
    header: "Outstanding Balance",
    cell: ({ row }) => {
      const balance = row.getValue("currentBalance");
      const creditLimit = row.original.creditLimit;
      const isOverLimit = balance > creditLimit;

      return (
        <div className="flex flex-col gap-1">
          <span
            className={`font-semibold ${
              isOverLimit ? "text-destructive" : "text-orange-600"
            }`}
          >
            {formatCurrency(balance || 0)}
          </span>
          {isOverLimit && (
            <Badge variant="destructive" className="text-xs w-fit">
              Over Limit
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "utilization",
    header: "Credit Used",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      const balance = row.original.currentBalance || 0;
      const creditLimit = row.original.creditLimit || 0;
      const percentage =
        creditLimit > 0 ? ((balance / creditLimit) * 100).toFixed(1) : 0;

      let variant = "default";
      if (percentage >= 100) variant = "destructive";
      else if (percentage >= 75) variant = "warning";

      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-secondary rounded-full h-2 max-w-[100px]">
            <div
              className={`h-2 rounded-full transition-all ${
                variant === "destructive"
                  ? "bg-destructive"
                  : variant === "warning"
                  ? "bg-orange-500"
                  : "bg-primary"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground min-w-[45px]">
            {percentage}%
          </span>
        </div>
      );
    },
  },
  {
    id: "available",
    header: "Available Credit",
    meta: { className: "hidden xl:table-cell" },
    cell: ({ row }) => {
      const balance = row.original.currentBalance || 0;
      const creditLimit = row.original.creditLimit || 0;
      const available = Math.max(creditLimit - balance, 0);

      return (
        <span className="font-medium text-green-600">
          {formatCurrency(available)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(customer)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            {onManageCredit && (
              <DropdownMenuItem onClick={() => onManageCredit(customer)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Credit
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
