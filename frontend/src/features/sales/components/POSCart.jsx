/**
 * POS Cart Component
 * Displays cart items with quantity controls
 * Supports keyboard navigation and shortcuts
 */

import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { usePOSStore } from "../store";
import { announceKeyboardAction } from "@/hooks/useKeyboardShortcuts";

const POSCart = () => {
  const items = usePOSStore((state) => state.items);
  const updateItemQuantity = usePOSStore((state) => state.updateItemQuantity);
  const updateItemDiscount = usePOSStore((state) => state.updateItemDiscount);
  const removeItem = usePOSStore((state) => state.removeItem);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // Handle keyboard shortcuts in cart
  const handleCartKeyboard = (e) => {
    if (items.length === 0) return;

    // Arrow down - select next item
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        selectedItemIndex === null
          ? 0
          : Math.min(selectedItemIndex + 1, items.length - 1);
      setSelectedItemIndex(nextIndex);
      announceKeyboardAction(
        `Selected item ${nextIndex + 1} of ${items.length}`,
      );
      return;
    }

    // Arrow up - select previous item
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedItemIndex === null) return;
      const prevIndex = Math.max(selectedItemIndex - 1, 0);
      setSelectedItemIndex(prevIndex);
      announceKeyboardAction(
        `Selected item ${prevIndex + 1} of ${items.length}`,
      );
      return;
    }

    // Only apply quantity shortcuts if an item is selected
    if (selectedItemIndex !== null) {
      const item = items[selectedItemIndex];

      // +/= - Increase quantity
      if (e.key === "+" || (e.shiftKey && e.key === "=")) {
        e.preventDefault();
        if (item.quantity < item.maxQuantity) {
          updateItemQuantity(selectedItemIndex, item.quantity + 1);
          announceKeyboardAction(
            `${item.productName} quantity: ${item.quantity + 1}`,
          );
        }
        return;
      }

      // - - Decrease quantity
      if (e.key === "-") {
        e.preventDefault();
        if (item.quantity > 1) {
          updateItemQuantity(selectedItemIndex, item.quantity - 1);
          announceKeyboardAction(
            `${item.productName} quantity: ${item.quantity - 1}`,
          );
        } else {
          removeItem(selectedItemIndex);
          setSelectedItemIndex(null);
          announceKeyboardAction(`${item.productName} removed from cart`);
        }
        return;
      }

      // Alt+1..9 - Set quantity directly
      if (e.altKey && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const targetQty = Math.min(
          parseInt(e.key, 10),
          item.maxQuantity || 9999,
        );
        updateItemQuantity(selectedItemIndex, targetQty);
        announceKeyboardAction(
          `${item.productName} quantity set to ${targetQty}`,
        );
        return;
      }

      // Delete - Remove item from cart
      if (e.key === "Delete") {
        e.preventDefault();
        removeItem(selectedItemIndex);
        if (selectedItemIndex >= items.length - 1 && selectedItemIndex > 0) {
          setSelectedItemIndex(selectedItemIndex - 1);
        } else {
          setSelectedItemIndex(null);
        }
        announceKeyboardAction(`${item.productName} removed from cart`);
        return;
      }

      // Enter - Toggle discount input focus
      if (e.key === "Enter") {
        e.preventDefault();
        const discountInput = document.querySelector(
          `[data-cart-discount-${selectedItemIndex}]`,
        );
        if (discountInput) {
          discountInput.focus();
          announceKeyboardAction("Discount input focused");
        }
        return;
      }
    }
  };

  useEffect(() => {
    const handleWindowKeyDown = (e) => {
      handleCartKeyboard(e);
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [items, selectedItemIndex, updateItemQuantity, removeItem]);

  // Auto-select first item if none is selected
  useEffect(() => {
    if (items.length > 0 && selectedItemIndex === null) {
      setSelectedItemIndex(0);
    }
  }, [items.length, selectedItemIndex]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-lg">Cart is empty</p>
        <p className="text-sm">Search for products to add them here</p>
        <p className="text-xs mt-4 text-muted-foreground">
          💡 Use ↑↓ to navigate items, +/- to adjust quantity, Delete to remove
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-2 pr-2 sm:pr-4 pt-2">
        {/* Cart Instructions */}
        <p className="text-xs text-muted-foreground px-2 sm:px-3 py-2 bg-muted/50 rounded">
          💡 ↑↓ Select | +/- Adjust Qty | Alt+1..9 Set Qty | Delete Remove |
          Enter Discount
        </p>

        {/* Cart Items */}
        <div className="space-y-2">
          {items.map((item, index) => {
            const itemTotal = item.unitPrice * item.quantity;
            const discountAmount = (itemTotal * item.discount) / 100;
            const finalTotal = itemTotal - discountAmount;
            const isSelected = selectedItemIndex === index;

            return (
              <div
                key={`${item.productId}-${item.batchId || index}`}
                className={`flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-card transition-all cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10"
                    : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedItemIndex(index)}
                tabIndex={0}
                role="button"
                title={`Item ${index + 1}: ${item.productName}`}
              >
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <p className="font-medium text-sm truncate">
                      {item.productName}
                    </p>
                    {item.isPrescriptionRequired && (
                      <Badge variant="destructive" className="text-xs h-4">
                        ℞
                      </Badge>
                    )}
                    {item.isNarcotic && (
                      <Badge variant="destructive" className="text-xs h-4">
                        N
                      </Badge>
                    )}
                    {item.isRefrigerated && (
                      <Badge variant="default" className="text-xs h-4">
                        ❄️
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {item.sku || item.productCode}
                    </p>
                    {item.batchNumber && (
                      <p className="text-xs text-muted-foreground truncate">
                        <span className="font-semibold">Batch:</span>{" "}
                        {item.batchNumber}
                        {item.expiryDate &&
                          ` • Exp: ${new Date(item.expiryDate).toLocaleDateString()}`}
                      </p>
                    )}
                    {(item.strength || item.dosageForm) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.strength}{" "}
                        {item.dosageForm && `• ${item.dosageForm}`}
                      </p>
                    )}
                    {item.manufacturer && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.manufacturer}
                      </p>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium mt-1">
                    {formatCurrency(item.unitPrice)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-1 sm:gap-2">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() =>
                        updateItemQuantity(index, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemQuantity(index, parseInt(e.target.value) || 0)
                      }
                      className="w-12 sm:w-16 h-7 sm:h-8 text-center text-sm"
                      min={0}
                      max={item.maxQuantity}
                      data-cart-qty={index}
                      title={`Quantity for ${item.productName} (use +/- or Alt+1..9)`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() =>
                        updateItemQuantity(index, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Item Discount - hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-1">
                    <Percent className="h-3 w-3 text-muted-foreground" />
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        updateItemDiscount(
                          index,
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-16 h-6 text-center text-xs focus-visible:ring-2 focus-visible:ring-blue-400"
                      min={0}
                      max={100}
                      data-cart-discount={index}
                      title={`Discount for ${item.productName} (Enter to focus, use +/- to adjust quantity)`}
                    />
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    {item.discount > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(itemTotal)}
                      </p>
                    )}
                    <p className="font-bold text-sm">
                      {formatCurrency(finalTotal)}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/50"
                  onClick={() => removeItem(index)}
                  title={`Remove ${item.productName} from cart`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default POSCart;
