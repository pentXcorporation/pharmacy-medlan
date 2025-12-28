/**
 * RecentSalesWidget Component
 * Displays recent sales transactions
 */

import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/config";
import { formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "@/components/common";

/**
 * Single sale item
 */
const SaleItem = ({ sale }) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {sale.customerName?.slice(0, 2).toUpperCase() || "WK"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">
            {sale.customerName || "Walk-in Customer"}
          </p>
          <StatusBadge status={sale.status} size="sm" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>#{sale.invoiceNumber}</span>
          <span>•</span>
          <span>{sale.itemCount} items</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatCurrency(sale.total)}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {sale.paymentMethod?.toLowerCase().replace("_", " ")}
        </p>
      </div>
    </div>
  );
};

/**
 * Loading skeleton
 */
const SalesSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-3 py-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="space-y-1 text-right">
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * RecentSalesWidget component
 */
const RecentSalesWidget = ({ sales = [], isLoading = false }) => {
  const hasSales = sales.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Recent Sales
            </CardTitle>
            <CardDescription>
              Latest transactions at your branch
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.POS.HISTORY}>
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SalesSkeleton />
        ) : hasSales ? (
          <ScrollArea className="h-[350px]">
            <div className="divide-y">
              {sales.map((sale) => (
                <SaleItem key={sale.id} sale={sale} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <ShoppingCart className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">No sales recorded today</p>
            <Button variant="link" asChild className="mt-2">
              <Link to={ROUTES.POS.NEW_SALE}>Start a new sale</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSalesWidget;
