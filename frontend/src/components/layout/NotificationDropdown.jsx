/**
 * Notification Dropdown Component
 * Real-time notification bell with actionable items for high-speed workflows
 */

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  AlertTriangle,
  Info,
  Package,
  ShoppingCart,
  ArrowRight,
  FileCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store";
import { NOTIFICATION_TYPE, ALERT_LEVEL } from "@/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

/**
 * Get icon for notification type
 */
const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPE.LOW_STOCK:
    case NOTIFICATION_TYPE.EXPIRY_WARNING:
      return AlertTriangle;
    case NOTIFICATION_TYPE.ORDER_UPDATE:
    case "REORDER_SUGGESTION": // New type from backend
      return Package;
    case NOTIFICATION_TYPE.SALE_COMPLETE:
      return ShoppingCart;
    default:
      return Info;
  }
};

/**
 * Single notification item with Quick Actions
 */
const NotificationItem = ({ notification, onMarkRead, onDismiss }) => {
  const navigate = useNavigate();
  const Icon = getNotificationIcon(notification.type);
  
  // Alert colors
  const colorClass = 
    notification.priority === ALERT_LEVEL.CRITICAL ? "text-destructive" :
    notification.priority === ALERT_LEVEL.WARNING ? "text-amber-500" : "text-blue-500";

  // Quick Action Handler
  const handleAction = (e) => {
    e.stopPropagation();
    if (notification.type === "REORDER_SUGGESTION") {
        navigate("/purchase-orders/drafts"); // Direct link to auto-drafts
        onMarkRead(notification.id);
    } else if (notification.type === "LOW_STOCK_ALERT") {
        navigate(`/inventory?product=${notification.referenceId}`);
        onMarkRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-3 hover:bg-accent transition-colors cursor-pointer group",
        !notification.read && "bg-accent/50"
      )}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className={cn("shrink-0 mt-0.5", colorClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        
        {/* Quick Action Button */}
        {notification.type === "REORDER_SUGGESTION" && (
            <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 h-7 text-xs w-full justify-between"
                onClick={handleAction}
            >
                Review Draft Orders <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
        )}
        
        <p className="text-[10px] text-muted-foreground mt-1 text-right">
          {notification.createdAt
            ? formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })
            : "Just now"}
        </p>
      </div>
      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Notification dropdown component
 */
const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <DropdownMenuLabel className="flex items-center justify-between pb-2">
          <span className="font-bold">Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Read All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={clearAll}
              >
                Clear
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={markAsRead}
                  onDismiss={removeNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;