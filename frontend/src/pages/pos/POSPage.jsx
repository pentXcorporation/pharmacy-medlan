/**
 * POS Page
 * Main point of sale terminal interface
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Clock, PauseCircle, Receipt, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common";
import { useProducts } from "@/features/products";
import { useCustomers } from "@/features/customers";
import {
  POSProductSearch,
  POSCart,
  POSTotals,
  usePOSStore,
  useCreateSale,
} from "@/features/sales";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/config";

const POSPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showHeldSalesSheet, setShowHeldSalesSheet] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Store
  const customer = usePOSStore((state) => state.customer);
  const setCustomer = usePOSStore((state) => state.setCustomer);
  const clearCustomer = usePOSStore((state) => state.clearCustomer);
  const heldSales = usePOSStore((state) => state.heldSales);
  const recallSale = usePOSStore((state) => state.recallSale);
  const removeHeldSale = usePOSStore((state) => state.removeHeldSale);
  const clearCart = usePOSStore((state) => state.clearCart);

  // Queries
  const { data: productsData, isLoading: productsLoading } = useProducts({
    inStock: true,
  });
  const { data: customersData } = useCustomers();
  const createSaleMutation = useCreateSale();

  const products = productsData?.content || productsData || [];
  const customers = customersData?.content || customersData || [];

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter customers
  const filteredCustomers =
    customerSearch.length >= 2
      ? customers
          .filter(
            (c) =>
              c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
              c.phone?.includes(customerSearch)
          )
          .slice(0, 5)
      : [];

  // Handle checkout
  const handleCheckout = async (saleData) => {
    const payload = {
      customerId: saleData.customer?.id,
      items: saleData.items.map((item) => ({
        productId: item.productId,
        batchId: item.batchId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discount,
      })),
      discountType:
        saleData.discount.type === "percentage" ? "PERCENTAGE" : "FIXED",
      discountValue: saleData.discount.value,
      paymentMethod: saleData.payment.method,
      amountTendered: saleData.payment.amountTendered,
      reference: saleData.payment.reference,
    };

    const result = await createSaleMutation.mutateAsync(payload);
    if (result) {
      setLastSale(result);
      setShowReceiptDialog(true);
      clearCart();
    }
  };

  // Handle customer selection
  const handleSelectCustomer = (cust) => {
    setCustomer(cust);
    setShowCustomerDialog(false);
    setCustomerSearch("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] sm:h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-background px-2 sm:px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">POS</h1>
          <Badge variant="outline" className="gap-1 hidden sm:flex">
            <User className="h-3 w-3" />
            {user?.firstName || user?.username}
          </Badge>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <Badge variant="outline" className="gap-1 hidden md:flex">
            <Clock className="h-3 w-3" />
            {currentTime.toLocaleTimeString()}
          </Badge>
          <Sheet open={showHeldSalesSheet} onOpenChange={setShowHeldSalesSheet}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 px-2 sm:px-3"
              >
                <PauseCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Held</span> (
                {heldSales.length})
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Held Sales</SheetTitle>
                <SheetDescription>
                  Resume a held sale to continue
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                {heldSales.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No held sales
                  </p>
                ) : (
                  heldSales.map((sale) => (
                    <Card key={sale.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{sale.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(sale.timestamp)}
                            </p>
                          </div>
                          <p className="font-bold">{sale.items.length} items</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              recallSale(sale.id);
                              setShowHeldSalesSheet(false);
                            }}
                          >
                            Resume
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeHeldSale(sale.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="outline"
            size="sm"
            className="px-2 sm:px-3"
            onClick={() => navigate(ROUTES.SALES.LIST)}
          >
            <Receipt className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">History</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-2 sm:px-3 hidden md:flex"
            onClick={() => navigate(ROUTES.SALE_RETURNS.CREATE)}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Return
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Products & Cart */}
        <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden">
          {/* Product Search */}
          <POSProductSearch products={products} isLoading={productsLoading} />

          {/* Customer Selection */}
          <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 text-sm"
              size="sm"
              onClick={() => setShowCustomerDialog(true)}
            >
              <User className="h-4 w-4" />
              <span className="truncate max-w-[100px] sm:max-w-none">
                {customer ? customer.name : "Walk-in"}
              </span>
            </Button>
            {customer && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {customer.loyaltyPoints || 0} pts
                </Badge>
                <Button variant="ghost" size="sm" onClick={clearCustomer}>
                  Clear
                </Button>
              </>
            )}
          </div>

          <Separator className="my-2 sm:my-4" />

          {/* Cart */}
          <POSCart />
        </div>

        {/* Right Panel - Totals */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l p-2 sm:p-4 flex flex-col shrink-0">
          <POSTotals
            onCheckout={handleCheckout}
            isProcessing={createSaleMutation.isPending}
          />
        </div>
      </div>

      {/* Customer Search Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>
              Search for an existing customer or continue as walk-in
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Search Customer</Label>
              <Input
                placeholder="Search by name or phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>
            {filteredCustomers.length > 0 && (
              <div className="border rounded-md divide-y">
                {filteredCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    className="w-full p-3 text-left hover:bg-muted flex justify-between"
                    onClick={() => handleSelectCustomer(cust)}
                  >
                    <div>
                      <p className="font-medium">{cust.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cust.phone}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {cust.loyaltyPoints || 0} pts
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomerDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                clearCustomer();
                setShowCustomerDialog(false);
              }}
            >
              Walk-in Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Sale Complete!
            </DialogTitle>
          </DialogHeader>
          {lastSale && (
            <div className="text-center space-y-4 py-4">
              <Receipt className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="text-xl font-bold">{lastSale.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(lastSale.totalAmount)}
                </p>
              </div>
              {lastSale.change > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(lastSale.change)}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowReceiptDialog(false)}
            >
              New Sale
            </Button>
            <Button onClick={() => window.print()}>Print Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POSPage;
