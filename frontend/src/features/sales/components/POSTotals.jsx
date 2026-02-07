/**
 * POS Totals Component
 * Displays cart totals and checkout controls
 * Supports keyboard navigation for payment methods, discounts, and actions
 */

import { useState, useMemo, useEffect } from "react";
import {
  Percent,
  DollarSign,
  CreditCard,
  Banknote,
  QrCode,
  AlertTriangle,
  Info,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/utils/formatters";
import { usePOSStore } from "../store";
import { ButtonSpinner } from "@/components/common";
import { PAYMENT_METHOD } from "@/constants/paymentMethods";
import { announceKeyboardAction } from "@/hooks/useKeyboardShortcuts";

const paymentMethods = [
  { value: PAYMENT_METHOD.CASH, label: "Cash", icon: Banknote },
  { value: PAYMENT_METHOD.CARD, label: "Card", icon: CreditCard },
  { value: PAYMENT_METHOD.UPI, label: "UPI / QR", icon: QrCode },
];

const POSTotals = ({ onCheckout, isProcessing, hasBranch = true }) => {
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
    state.getItemDiscountTotal(),
  );
  const cartDiscount = usePOSStore((state) => state.getCartDiscount());
  const taxTotal = usePOSStore((state) => state.getTaxTotal());
  const grandTotal = usePOSStore((state) => state.getGrandTotal());
  const changeDue = usePOSStore((state) => state.getChangeDue());

  const [discountType, setDiscountType] = useState(discount.type);
  const [discountValue, setDiscountValue] = useState(discount.value);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);

  // Sync local discount state with store when cart is cleared
  useEffect(() => {
    setDiscountType(discount.type);
    setDiscountValue(discount.value);
  }, [discount.type, discount.value]);

  // Update selected payment index when payment method changes
  useEffect(() => {
    const index = paymentMethods.findIndex((m) => m.value === payment.method);
    setSelectedPaymentIndex(index >= 0 ? index : 0);
  }, [payment.method]);

  // Check for special product requirements and warnings
  const cartWarnings = useMemo(() => {
    const warnings = {
      prescriptionRequired: false,
      narcoticPresent: false,
      refrigeratedItems: false,
      expiringItems: [],
      lowStockItems: [],
    };

    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    items.forEach((item) => {
      if (item.isPrescriptionRequired) warnings.prescriptionRequired = true;
      if (item.isNarcotic) warnings.narcoticPresent = true;
      if (item.isRefrigerated) warnings.refrigeratedItems = true;

      // Check expiry date
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        if (expiryDate < thirtyDaysFromNow) {
          warnings.expiringItems.push({
            name: item.productName,
            expiryDate: item.expiryDate,
            isExpired: expiryDate < today,
          });
        }
      }

      // Check low stock
      if (item.maxQuantity <= 10) {
        warnings.lowStockItems.push({
          name: item.productName,
          stock: item.maxQuantity,
        });
      }
    });

    return warnings;
  }, [items]);

  const handleDiscountChange = (value) => {
    setDiscountValue(value);
    setDiscount({ type: discountType, value: parseFloat(value) || 0 });
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
    setDiscount({ type, value: discountValue });
  };

  const handleCheckout = () => {
    if (
      payment.method === PAYMENT_METHOD.CASH &&
      payment.amountTendered < grandTotal
    ) {
      return; // Not enough cash
    }

    // For non-cash payments, ensure amountTendered equals grandTotal
    const finalPayment = {
      ...payment,
      amountTendered:
        payment.method === PAYMENT_METHOD.CASH
          ? payment.amountTendered
          : grandTotal,
    };

    onCheckout?.({
      items,
      customer,
      discount,
      payment: finalPayment,
      subtotal,
      taxTotal,
      grandTotal,
    });
  };

  const handleHold = () => {
    holdSale();
  };

  // Handle keyboard shortcuts for payment methods
  const handlePaymentKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (selectedPaymentIndex + 1) % paymentMethods.length;
      setSelectedPaymentIndex(nextIndex);
      setPayment({ method: paymentMethods[nextIndex].value });
      announceKeyboardAction(
        `Selected ${paymentMethods[nextIndex].label} payment method`,
      );
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex =
        selectedPaymentIndex - 1 < 0
          ? paymentMethods.length - 1
          : selectedPaymentIndex - 1;
      setSelectedPaymentIndex(prevIndex);
      setPayment({ method: paymentMethods[prevIndex].value });
      announceKeyboardAction(
        `Selected ${paymentMethods[prevIndex].label} payment method`,
      );
    } else if (e.altKey && e.key === "1") {
      // Alt+1 for Cash
      e.preventDefault();
      setSelectedPaymentIndex(0);
      setPayment({ method: PAYMENT_METHOD.CASH });
      announceKeyboardAction("Selected Cash payment method");
    } else if (e.altKey && e.key === "2") {
      // Alt+2 for Card
      e.preventDefault();
      setSelectedPaymentIndex(1);
      setPayment({ method: PAYMENT_METHOD.CARD });
      announceKeyboardAction("Selected Card payment method");
    } else if (e.altKey && e.key === "3") {
      // Alt+3 for UPI
      e.preventDefault();
      setSelectedPaymentIndex(2);
      setPayment({ method: PAYMENT_METHOD.UPI });
      announceKeyboardAction("Selected UPI payment method");
    }
  };

  // Setup window-level keyboard listener for Alt+1/2/3
  useEffect(() => {
    const handleWindowKeyDown = (e) => {
      if (e.altKey && (e.key === "1" || e.key === "2" || e.key === "3")) {
        handlePaymentKeyDown(e);
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [selectedPaymentIndex]);

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1 flex flex-col">
        {/* Branch Warning */}
        {!hasBranch && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              ⚠️ No branch selected. Please select a branch from settings to
              complete sales.
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings Section */}
        {(cartWarnings.prescriptionRequired ||
          cartWarnings.narcoticPresent ||
          cartWarnings.refrigeratedItems ||
          cartWarnings.expiringItems.length > 0 ||
          cartWarnings.lowStockItems.length > 0) && (
          <div className="space-y-2">
            {cartWarnings.prescriptionRequired && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  ℞ Prescription required for some items
                </AlertDescription>
              </Alert>
            )}
            {cartWarnings.narcoticPresent && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Narcotic/Schedule X drug in cart - requires documentation
                </AlertDescription>
              </Alert>
            )}
            {cartWarnings.refrigeratedItems && (
              <Alert className="py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  ❄️ Cold storage items - handle with care
                </AlertDescription>
              </Alert>
            )}
            {cartWarnings.expiringItems.length > 0 && (
              <Alert variant="warning" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {cartWarnings.expiringItems.some((i) => i.isExpired)
                    ? "⚠️ EXPIRED products in cart!"
                    : `⏰ ${cartWarnings.expiringItems.length} item(s) expiring within 30 days`}
                </AlertDescription>
              </Alert>
            )}
            {cartWarnings.lowStockItems.length > 0 && (
              <Alert variant="warning" className="py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  📦 Low stock: {cartWarnings.lowStockItems.length} item(s)
                </AlertDescription>
              </Alert>
            )}
            <Separator />
          </div>
        )}

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
          <Label className="text-sm">Cart Discount (Alt+D)</Label>
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
                aria-label="Discount amount"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-2" data-tour-payment>
          <Label className="text-sm">
            Payment Method (Use ← → arrows or Alt+1/2/3)
          </Label>
          <div
            className="grid grid-cols-3 gap-2"
            onKeyDown={handlePaymentKeyDown}
          >
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Button
                  key={method.value}
                  variant={
                    payment.method === method.value ? "default" : "outline"
                  }
                  className={`flex flex-col h-auto py-3 transition-all ${
                    payment.method === method.value
                      ? "ring-2 ring-blue-500 focus-visible:ring-2"
                      : ""
                  } focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none`}
                  onClick={() => setPayment({ method: method.value })}
                  tabIndex={payment.method === method.value ? 0 : -1}
                  title={`${method.label} (Alt+${index + 1})`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{method.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Cash Tendered */}
        {payment.method === PAYMENT_METHOD.CASH && (
          <div className="space-y-2">
            <Label className="text-sm">Amount Tendered (Alt+T)</Label>
            <Input
              type="number"
              value={payment.amountTendered || ""}
              onChange={(e) =>
                setPayment({ amountTendered: parseFloat(e.target.value) || 0 })
              }
              className="text-lg font-bold"
              min={0}
              aria-label="Amount tendered"
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
        {payment.method === PAYMENT_METHOD.CARD && (
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
          className="w-full h-12 sm:h-14 text-base sm:text-lg mt-auto"
          onClick={handleCheckout}
          disabled={
            !hasBranch ||
            items.length === 0 ||
            isProcessing ||
            (payment.method === PAYMENT_METHOD.CASH &&
              payment.amountTendered < grandTotal)
          }
          data-complete-sale
          title="Complete Sale (F9 or Ctrl+Enter)"
        >
          {isProcessing && <ButtonSpinner />}
          Complete Sale
        </Button>
      </CardContent>
    </Card>
  );
};

export default POSTotals;
