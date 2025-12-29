/**
 * POS Totals Component
 * Displays cart totals and checkout controls
 */

import { useState } from "react";
import {
  Percent,
  DollarSign,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { usePOSStore } from "../store";
import { ButtonSpinner } from "@/components/common";

const paymentMethods = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "CARD", label: "Card", icon: CreditCard },
  { value: "QR", label: "QR Payment", icon: QrCode },
];

const POSTotals = ({ onCheckout, isProcessing }) => {
  const items = usePOSStore((state) => state.items);
  const customer = usePOSStore((state) => state.customer);
  const discount = usePOSStore((state) => state.discount);
  const payment = usePOSStore((state) => state.payment);
  const setDiscount = usePOSStore((state) => state.setDiscount);
  const setPayment = usePOSStore((state) => state.setPayment);
  const clearCart = usePOSStore((state) => state.clearCart);
  const holdSale = usePOSStore((state) => state.holdSale);

  const subtotal = usePOSStore((state) => state.getSubtotal());
  const itemDiscountTotal = usePOSStore((state) =>
    state.getItemDiscountTotal()
  );
  const cartDiscount = usePOSStore((state) => state.getCartDiscount());
  const taxTotal = usePOSStore((state) => state.getTaxTotal());
  const grandTotal = usePOSStore((state) => state.getGrandTotal());
  const changeDue = usePOSStore((state) => state.getChangeDue());

  const [discountType, setDiscountType] = useState(discount.type);
  const [discountValue, setDiscountValue] = useState(discount.value);

  const handleDiscountChange = (value) => {
    setDiscountValue(value);
    setDiscount({ type: discountType, value: parseFloat(value) || 0 });
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
    setDiscount({ type, value: discountValue });
  };

  const handleCheckout = () => {
    if (payment.method === "CASH" && payment.amountTendered < grandTotal) {
      return; // Not enough cash
    }
    onCheckout?.({
      items,
      customer,
      discount,
      payment,
      subtotal,
      taxTotal,
      grandTotal,
    });
  };

  const handleHold = () => {
    holdSale();
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {itemDiscountTotal > 0 && (
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Item Discounts</span>
              <span>-{formatCurrency(itemDiscountTotal)}</span>
            </div>
          )}
          {cartDiscount > 0 && (
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Cart Discount</span>
              <span>-{formatCurrency(cartDiscount)}</span>
            </div>
          )}
          {taxTotal > 0 && (
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Tax</span>
              <span>+{formatCurrency(taxTotal)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg sm:text-xl font-bold">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <Separator />

        {/* Cart Discount */}
        <div className="space-y-2">
          <Label className="text-sm">Cart Discount</Label>
          <div className="flex gap-2">
            <Select
              value={discountType}
              onValueChange={handleDiscountTypeChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="fixed">Rs.</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              {discountType === "percentage" ? (
                <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              ) : (
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => handleDiscountChange(e.target.value)}
                className="pl-9"
                min={0}
                max={discountType === "percentage" ? 100 : subtotal}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-2">
          <Label className="text-sm">Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Button
                  key={method.value}
                  variant={
                    payment.method === method.value ? "default" : "outline"
                  }
                  className="flex flex-col h-auto py-3"
                  onClick={() => setPayment({ method: method.value })}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{method.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Cash Tendered */}
        {payment.method === "CASH" && (
          <div className="space-y-2">
            <Label className="text-sm">Amount Tendered</Label>
            <Input
              type="number"
              value={payment.amountTendered || ""}
              onChange={(e) =>
                setPayment({ amountTendered: parseFloat(e.target.value) || 0 })
              }
              className="text-lg font-bold"
              min={0}
            />
            {payment.amountTendered >= grandTotal && (
              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>Change</span>
                <span>{formatCurrency(changeDue)}</span>
              </div>
            )}
          </div>
        )}

        {/* Card Reference */}
        {payment.method === "CARD" && (
          <div className="space-y-2">
            <Label className="text-sm">Card Reference / Last 4 Digits</Label>
            <Input
              value={payment.reference || ""}
              onChange={(e) => setPayment({ reference: e.target.value })}
              placeholder="XXXX"
              maxLength={4}
            />
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleHold}
            disabled={items.length === 0}
          >
            Hold Sale
          </Button>
          <Button
            variant="outline"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Clear
          </Button>
        </div>

        <Button
          className="w-full h-12 sm:h-14 text-base sm:text-lg"
          onClick={handleCheckout}
          disabled={
            items.length === 0 ||
            isProcessing ||
            (payment.method === "CASH" && payment.amountTendered < grandTotal)
          }
        >
          {isProcessing && <ButtonSpinner />}
          Complete Sale
        </Button>
      </CardContent>
    </Card>
  );
};

export default POSTotals;
