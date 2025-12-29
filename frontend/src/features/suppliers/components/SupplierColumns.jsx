/**
 * Supplier Columns Definition
 * Defines the columns for the suppliers DataTable
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
  CheckCircle,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

/**
 * Get column definitions for suppliers table
 */
export const getSupplierColumns = ({
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onCreatePO,
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
    accessorKey: "supplierCode",
    header: "Code",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("supplierCode")}</span>
    ),
  },
  {
    accessorKey: "supplierName",
    header: "Supplier Name",
    cell: ({ row }) => (
      <div className="max-w-[120px] sm:max-w-none">
        <div className="font-medium text-sm truncate">
          {row.getValue("supplierName")}
        </div>
        {row.original.contactPerson && (
          <div className="text-xs text-muted-foreground truncate hidden sm:block">
            Contact: {row.original.contactPerson}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.getValue("phone") || row.original.mobile || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => row.getValue("email") || "-",
  },
  {
    accessorKey: "city",
    header: "City",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => row.getValue("city") || "-",
  },
  {
    accessorKey: "paymentTerms",
    header: "Payment Terms",
    meta: { className: "hidden xl:table-cell" },
    cell: ({ row }) => {
      const days = row.getValue("paymentTerms");
      return days ? `${days} days` : "-";
    },
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => {
      const balance = row.getValue("outstandingBalance") || 0;
      return (
        <span
          className={
            balance > 0 ? "text-red-600 font-medium text-sm" : "text-sm"
          }
        >
          {formatCurrency(balance)}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(supplier)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(supplier)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {supplier.isActive && (
              <DropdownMenuItem onClick={() => onCreatePO?.(supplier)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create PO
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {supplier.isActive ? (
              <DropdownMenuItem onClick={() => onDeactivate?.(supplier)}>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onActivate?.(supplier)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(supplier)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export default getSupplierColumns;
