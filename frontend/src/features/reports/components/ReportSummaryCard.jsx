/**
 * Report Summary Card Component
 * Displays a summary metric in a card format
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * ReportSummaryCard component
 */
const ReportSummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}) => {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trendValue && (
              <span
                className={cn(
                  "mr-1",
                  trendColors[trend] || trendColors.neutral
                )}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}{" "}
                {trendValue}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportSummaryCard;
