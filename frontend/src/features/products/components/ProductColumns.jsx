/**
 * Product Columns Definition
 * Column definitions for product DataTable
 */

import { MoreHorizontal, Eye, Edit, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/formatters";
import { PRODUCT_TYPE_LABELS, PRODUCT_TYPE_BADGE_CLASS } from "@/constants";

/**
 * Get product table columns
 */
export const getProductColumns = ({
  onView,
  onEdit,
  onDelete,
  onDiscontinue,
}) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "productCode",
    header: "Code",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("productCode")}</span>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[150px] sm:max-w-none">
        <span className="font-medium text-sm truncate">
          {row.getValue("productName")}
        </span>
        {row.original.genericName && (
          <span className="text-xs text-muted-foreground truncate">
            {row.original.genericName}
          </span>
        )}
      </div>
    ),
    size: 300,
    enableSorting: true,
  },
  {
    accessorKey: "categoryName",
    id: "categoryName",
    header: "Category",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.category?.categoryName || "-"}
      </Badge>
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "productType",
    header: "Type",
    meta: { className: "hidden lg:table-cell" },
    cell: ({ row }) => {
      const type = row.getValue("productType");
      if (!type)
        return <span className="text-sm text-muted-foreground">-</span>;
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
            PRODUCT_TYPE_BADGE_CLASS[type] || "bg-gray-100 text-gray-800"
          }`}
        >
          {PRODUCT_TYPE_LABELS[type] || type}
        </span>
      );
    },
    size: 160,
    enableSorting: true,
  },
  {
    accessorKey: "sellingPrice",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium text-sm">
        {formatCurrency(row.getValue("sellingPrice"))}
      </span>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      const isDiscontinued = row.original.isDiscontinued;

      if (isDiscontinued) {
        return (
          <Badge variant="destructive" className="text-xs">
            Discontinued
          </Badge>
        );
      }
      return (
        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    size: 120,
    enableSorting: true,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView?.(product)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {!product.isDiscontinued && (
              <DropdownMenuItem onClick={() => onDiscontinue?.(product)}>
                <XCircle className="mr-2 h-4 w-4" />
                Discontinue
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(product)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 50,
  },
];

export default getProductColumns;
