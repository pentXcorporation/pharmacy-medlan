/**
 * Branch Columns Definition
 * Defines the columns for the branches DataTable
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
  Building2,
} from "lucide-react";

/**
 * Get column definitions for branches table
 */
export const getBranchColumns = ({
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
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
    accessorKey: "branchCode",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("branchCode")}</span>
    ),
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="font-medium">{row.getValue("branchName")}</div>
          {row.original.isMainBranch && (
            <Badge variant="secondary" className="mt-1">
              Main Branch
            </Badge>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {[row.original.city, row.original.district]
          .filter(Boolean)
          .join(", ") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.getValue("phone") || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") || "-",
  },
  {
    id: "hours",
    header: "Hours",
    cell: ({ row }) => {
      const opening = row.original.openingTime;
      const closing = row.original.closingTime;
      if (!opening && !closing) return "-";
      return `${opening || "?"} - ${closing || "?"}`;
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
      const branch = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(branch)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(branch)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {branch.isActive ? (
              <DropdownMenuItem onClick={() => onDeactivate?.(branch)}>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onActivate?.(branch)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(branch)}
              className="text-destructive focus:text-destructive"
              disabled={branch.isMainBranch}
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

export default getBranchColumns;
