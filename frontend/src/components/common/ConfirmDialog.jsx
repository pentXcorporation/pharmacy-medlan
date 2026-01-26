/**
 * ConfirmDialog Component
 * Reusable confirmation dialog with customizable actions
 */

import { AlertTriangle, Trash2, LogOut, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

/**
 * Dialog variant icons
 */
const VARIANT_ICONS = {
  danger: Trash2,
  warning: AlertTriangle,
  info: Info,
  logout: LogOut,
  default: AlertCircle,
};

/**
 * Dialog variant styles
 */
const VARIANT_STYLES = {
  danger: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    buttonVariant: "destructive",
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonVariant: "default",
  },
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonVariant: "default",
  },
  logout: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    buttonVariant: "destructive",
  },
  default: {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    buttonVariant: "default",
  },
};

/**
 * Standalone ConfirmDialog component
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  icon: CustomIcon,
}) => {
  const Icon = CustomIcon || VARIANT_ICONS[variant] || VARIANT_ICONS.default;
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  const handleConfirm = () => {
    onConfirm?.();
    if (!isLoading) {
      onOpenChange?.(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="top-[20%] translate-y-0">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn("rounded-full p-2", styles.iconBg)}>
              <Icon className={cn("h-6 w-6", styles.iconColor)} />
            </div>
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              {description && (
                <AlertDialogDescription className="mt-2">
                  {description}
                </AlertDialogDescription>
              )}
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              styles.buttonVariant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/**
 * Global ConfirmDialog connected to UI store
 */
export const GlobalConfirmDialog = () => {
  const { confirmDialog, hideConfirmDialog } = useUiStore();

  if (!confirmDialog) return null;

  return (
    <ConfirmDialog
      open={confirmDialog.open}
      onOpenChange={(open) => {
        if (!open) hideConfirmDialog();
      }}
      title={confirmDialog.title}
      description={confirmDialog.description}
      variant={confirmDialog.variant}
      confirmLabel={confirmDialog.confirmLabel}
      cancelLabel={confirmDialog.cancelLabel}
      onConfirm={confirmDialog.onConfirm}
      onCancel={confirmDialog.onCancel}
      isLoading={confirmDialog.isLoading}
    />
  );
};

/**
 * useConfirm hook for imperative dialog usage
 */
export const useConfirm = () => {
  const { showConfirmDialog, hideConfirmDialog } = useUiStore();

  const confirm = (options) => {
    return new Promise((resolve) => {
      showConfirmDialog({
        ...options,
        onConfirm: () => {
          hideConfirmDialog();
          resolve(true);
        },
        onCancel: () => {
          hideConfirmDialog();
          resolve(false);
        },
      });
    });
  };

  return { confirm };
};

export default ConfirmDialog;
