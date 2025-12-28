/**
 * Notification Dropdown Component
 * Real-time notification bell with dropdown list
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

/**
 * Get icon for notification type
 */
const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPE.LOW_STOCK:
    case NOTIFICATION_TYPE.EXPIRY_WARNING:
      return AlertTriangle;
    case NOTIFICATION_TYPE.ORDER_UPDATE:
    case NOTIFICATION_TYPE.TRANSFER_UPDATE:
      return Package;
    case NOTIFICATION_TYPE.SALE_COMPLETE:
      return ShoppingCart;
    default:
      return Info;
  }
};

/**
 * Get color for alert level
 */
const getAlertColor = (level) => {
  switch (level) {
    case ALERT_LEVEL.CRITICAL:
      return "text-destructive";
    case ALERT_LEVEL.WARNING:
      return "text-amber-500";
    case ALERT_LEVEL.INFO:
      return "text-blue-500";
    default:
      return "text-muted-foreground";
  }
};

/**
 * Single notification item
 */
const NotificationItem = ({ notification, onMarkRead, onDismiss }) => {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getAlertColor(notification.level);

  return (
    <div
      className={cn(
        "flex gap-3 p-3 hover:bg-accent transition-colors",
        !notification.read && "bg-accent/50"
      )}
    >
      <div className={cn("shrink-0 mt-0.5", colorClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.createdAt
            ? formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })
            : "Just now"}
        </p>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMarkRead(notification.id)}
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onDismiss(notification.id)}
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
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
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
