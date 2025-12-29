/**
 * StatCard Component
 * Dashboard statistics card with icon, value, and trend indicator
 */

import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Trend indicator component
 */
const TrendIndicator = ({ value, suffix = "%" }) => {
  if (value === undefined || value === null) return null;

  const isPositive = value > 0;
  const isNeutral = value === 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm font-medium",
        isPositive && "text-emerald-600",
        !isPositive && !isNeutral && "text-destructive",
        isNeutral && "text-muted-foreground"
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-4 w-4" />
      ) : isNeutral ? (
        <Minus className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span>
        {isPositive && "+"}
        {value}
        {suffix}
      </span>
    </div>
  );
};

/**
 * Loading skeleton for stat card
 */
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-5 rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-20" />
    </CardContent>
  </Card>
);

/**
 * StatCard component for dashboard metrics
 * @param {Object} props
 * @param {string} props.variant - "default" | "success" | "warning" | "destructive"
 * @param {boolean} props.loading - Alias for isLoading
 */
const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel = "from last month",
  iconColor = "text-muted-foreground",
  iconBgColor = "bg-muted",
  isLoading = false,
  loading, // Alias for isLoading
  variant = "default",
  className,
  onClick,
}) => {
  // Support both isLoading and loading props
  const showLoading = isLoading || loading;
  
  if (showLoading) {
    return <StatCardSkeleton />;
  }

  // Variant styles for the card
  const variantStyles = {
    default: "",
    success: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20",
    warning: "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20",
    destructive: "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20",
  };

  // Variant colors for the icon
  const variantIconColors = {
    default: iconColor,
    success: "text-emerald-600",
    warning: "text-amber-600",
    destructive: "text-red-600",
  };

  const variantIconBgColors = {
    default: iconBgColor,
    success: "bg-emerald-100 dark:bg-emerald-900/50",
    warning: "bg-amber-100 dark:bg-amber-900/50",
    destructive: "bg-red-100 dark:bg-red-900/50",
  };

  // Render the icon properly based on its type
  const renderIcon = () => {
    if (!icon) return null;
    
    // If icon is a valid React element (JSX), render it directly
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        className: cn("h-4 w-4", variantIconColors[variant], icon.props?.className),
      });
    }
    
    // If icon is a component reference (function), render it as component
    if (typeof icon === "function") {
      const IconComponent = icon;
      return <IconComponent className={cn("h-4 w-4", variantIconColors[variant])} />;
    }
    
    return null;
  };

  return (
    <Card
      className={cn(
        "transition-all",
        variantStyles[variant],
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("rounded-md p-2", variantIconBgColors[variant])}>
            {renderIcon()}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend !== undefined && <TrendIndicator value={trend} />}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend !== undefined && trendLabel && (
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
