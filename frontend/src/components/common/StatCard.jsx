/**
 * StatCard Component
 * Dashboard statistics card with icon, value, and trend indicator
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Trend indicator component
 */
const TrendIndicator = ({ value, suffix = '%' }) => {
  if (value === undefined || value === null) return null;

  const isPositive = value > 0;
  const isNeutral = value === 0;

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-sm font-medium',
        isPositive && 'text-emerald-600',
        !isPositive && !isNeutral && 'text-destructive',
        isNeutral && 'text-muted-foreground'
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
        {isPositive && '+'}
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
 */
const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel = 'from last month',
  iconColor = 'text-muted-foreground',
  iconBgColor = 'bg-muted',
  isLoading = false,
  className,
  onClick,
}) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-primary/50',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('rounded-md p-2', iconBgColor)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
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
