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
import { DOSAGE_FORM_LABELS, DRUG_SCHEDULE_LABELS } from "@/constants";

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
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("productCode")}</span>
    ),
    size: 100,
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("productName")}</span>
        {row.original.genericName && (
          <span className="text-xs text-muted-foreground">
            {row.original.genericName}
          </span>
        )}
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: "category.categoryName",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.category?.categoryName || "-"}
      </Badge>
    ),
    size: 120,
  },
  {
    accessorKey: "dosageForm",
    header: "Form",
    cell: ({ row }) => (
      <span className="text-sm">
        {DOSAGE_FORM_LABELS[row.getValue("dosageForm")] ||
          row.getValue("dosageForm") ||
          "-"}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: "strength",
    header: "Strength",
    cell: ({ row }) => row.getValue("strength") || "-",
    size: 80,
  },
  {
    accessorKey: "drugSchedule",
    header: "Schedule",
    cell: ({ row }) => {
      const schedule = row.getValue("drugSchedule");
      if (!schedule) return "-";
      const variant =
        schedule === "X"
          ? "destructive"
          : schedule === "H"
          ? "warning"
          : "secondary";
      return (
        <Badge variant={variant}>
          {DRUG_SCHEDULE_LABELS[schedule] || schedule}
        </Badge>
      );
    },
    size: 80,
  },
  {
    accessorKey: "sellingPrice",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium">
        {formatCurrency(row.getValue("sellingPrice"))}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      const isDiscontinued = row.original.isDiscontinued;

      if (isDiscontinued) {
        return <Badge variant="destructive">Discontinued</Badge>;
      }
      return (
        <Badge variant={isActive ? "success" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    size: 100,
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
