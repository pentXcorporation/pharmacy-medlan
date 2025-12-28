/**
 * InventoryAlertsWidget Component
 * Displays low stock and expiring products alerts
 */

import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, Package, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config';
import { formatExpiryDate } from '@/utils/formatters';

/**
 * Single alert item
 */
const AlertItem = ({ item, type }) => {
  const isLowStock = type === 'low-stock';
  const isExpiring = type === 'expiring';

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`shrink-0 rounded-full p-2 ${
          isLowStock ? 'bg-amber-100' : 'bg-red-100'
        }`}
      >
        {isLowStock ? (
          <Package className="h-4 w-4 text-amber-600" />
        ) : (
          <Clock className="h-4 w-4 text-red-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.productName}</p>
        <p className="text-xs text-muted-foreground">
          {isLowStock
            ? `Stock: ${item.currentStock} (Min: ${item.reorderLevel})`
            : `Expires: ${formatExpiryDate(item.expiryDate).formatted}`}
        </p>
      </div>
      {isLowStock && item.currentStock === 0 && (
        <Badge variant="destructive" className="shrink-0">
          Out of Stock
        </Badge>
      )}
      {isExpiring && (
        <Badge
          variant="outline"
          className={`shrink-0 ${
            formatExpiryDate(item.expiryDate).status === 'expired'
              ? 'border-red-500 text-red-500'
              : 'border-amber-500 text-amber-500'
          }`}
        >
          {formatExpiryDate(item.expiryDate).status === 'expired'
            ? 'Expired'
            : 'Expiring'}
        </Badge>
      )}
    </div>
  );
};

/**
 * Loading skeleton
 */
const AlertsSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-3 py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * InventoryAlertsWidget component
 */
const InventoryAlertsWidget = ({
  lowStockItems = [],
  expiringItems = [],
  isLoading = false,
}) => {
  const hasLowStock = lowStockItems.length > 0;
  const hasExpiring = expiringItems.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Low Stock Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Products below reorder level</CardDescription>
            </div>
            {hasLowStock && (
              <Badge variant="secondary">{lowStockItems.length}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AlertsSkeleton />
          ) : hasLowStock ? (
            <>
              <ScrollArea className="h-[200px]">
                <div className="divide-y">
                  {lowStockItems.slice(0, 5).map((item, index) => (
                    <AlertItem key={item.id || index} item={item} type="low-stock" />
                  ))}
                </div>
              </ScrollArea>
              <Button variant="link" className="w-full mt-2" asChild>
                <Link to={ROUTES.PRODUCTS.LOW_STOCK}>
                  View all low stock items
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Package className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">All products are well stocked</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Products Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                Expiring Soon
              </CardTitle>
              <CardDescription>Products expiring within 30 days</CardDescription>
            </div>
            {hasExpiring && (
              <Badge variant="secondary">{expiringItems.length}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AlertsSkeleton />
          ) : hasExpiring ? (
            <>
              <ScrollArea className="h-[200px]">
                <div className="divide-y">
                  {expiringItems.slice(0, 5).map((item, index) => (
                    <AlertItem key={item.id || index} item={item} type="expiring" />
                  ))}
                </div>
              </ScrollArea>
              <Button variant="link" className="w-full mt-2" asChild>
                <Link to={ROUTES.PRODUCTS.EXPIRING}>
                  View all expiring products
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Clock className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">No products expiring soon</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAlertsWidget;
