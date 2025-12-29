/**
 * POS Cart Component
 * Displays cart items with quantity controls
 */

import { Minus, Plus, Trash2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/formatters";
import { usePOSStore } from "../store";

const POSCart = () => {
  const items = usePOSStore((state) => state.items);
  const updateItemQuantity = usePOSStore((state) => state.updateItemQuantity);
  const updateItemDiscount = usePOSStore((state) => state.updateItemDiscount);
  const removeItem = usePOSStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-lg">Cart is empty</p>
        <p className="text-sm">Search for products to add them here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-2 pr-2 sm:pr-4">
        {items.map((item, index) => {
          const itemTotal = item.unitPrice * item.quantity;
          const discountAmount = (itemTotal * item.discount) / 100;
          const finalTotal = itemTotal - discountAmount;

          return (
            <div
              key={`${item.productId}-${item.batchId || index}`}
              className="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-card"
            >
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.sku}
                </p>
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
                    onClick={() => updateItemQuantity(index, item.quantity - 1)}
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
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => updateItemQuantity(index, item.quantity + 1)}
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
                      updateItemDiscount(index, parseFloat(e.target.value) || 0)
                    }
                    className="w-16 h-6 text-center text-xs"
                    min={0}
                    max={100}
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
                className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default POSCart;
