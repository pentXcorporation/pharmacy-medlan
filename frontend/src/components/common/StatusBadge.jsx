/**
 * StatusBadge Component
 * Colored badge for displaying status values
 */

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Status color mapping
 */
const STATUS_COLORS = {
  // General
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-700 border-gray-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",

  // Sale status
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-amber-100 text-amber-700 border-amber-200",
  shipped: "bg-cyan-100 text-cyan-700 border-cyan-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  returned: "bg-purple-100 text-purple-700 border-purple-200",
  refunded: "bg-orange-100 text-orange-700 border-orange-200",

  // Payment status
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  unpaid: "bg-red-100 text-red-700 border-red-200",
  partial: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",

  // Purchase order status
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  received: "bg-blue-100 text-blue-700 border-blue-200",

  // GRN status
  complete: "bg-emerald-100 text-emerald-700 border-emerald-200",
  partial_received: "bg-amber-100 text-amber-700 border-amber-200",

  // Transfer status
  in_transit: "bg-blue-100 text-blue-700 border-blue-200",

  // Stock levels
  low: "bg-amber-100 text-amber-700 border-amber-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
  in_stock: "bg-emerald-100 text-emerald-700 border-emerald-200",

  // Expiry
  expired: "bg-red-100 text-red-700 border-red-200",
  expiring_soon: "bg-amber-100 text-amber-700 border-amber-200",
  valid: "bg-emerald-100 text-emerald-700 border-emerald-200",

  // Cheque status
  deposited: "bg-blue-100 text-blue-700 border-blue-200",
  cleared: "bg-emerald-100 text-emerald-700 border-emerald-200",
  bounced: "bg-red-100 text-red-700 border-red-200",

  // Authorization
  authorized: "bg-emerald-100 text-emerald-700 border-emerald-200",
  unauthorized: "bg-red-100 text-red-700 border-red-200",

  // Alert levels
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  critical: "bg-red-100 text-red-700 border-red-200",

  // Default
  default: "bg-gray-100 text-gray-700 border-gray-200",
};

/**
 * StatusBadge component
 */
const StatusBadge = ({
  status,
  label,
  variant = "outline",
  size = "default",
  className,
  dot = false,
}) => {
  // Normalize status for lookup
  const normalizedStatus =
    status?.toLowerCase().replace(/[- ]/g, "_") || "default";
  const colorClasses = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.default;

  // Display label (use provided label or format status)
  const displayLabel =
    label ||
    status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Badge
      variant={variant}
      className={cn(
        "font-medium capitalize whitespace-nowrap",
        colorClasses,
        size === "sm" && "text-xs px-2 py-0",
        size === "lg" && "text-sm px-3 py-1",
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            normalizedStatus === "active" ||
              normalizedStatus === "completed" ||
              normalizedStatus === "paid"
              ? "bg-emerald-500"
              : normalizedStatus === "pending" ||
                normalizedStatus === "processing"
              ? "bg-amber-500"
              : normalizedStatus === "cancelled" ||
                normalizedStatus === "rejected" ||
                normalizedStatus === "expired"
              ? "bg-red-500"
              : "bg-gray-500"
          )}
        />
      )}
      {displayLabel}
    </Badge>
  );
};

export default StatusBadge;
