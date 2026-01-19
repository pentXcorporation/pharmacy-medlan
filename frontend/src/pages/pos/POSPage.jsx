/**
 * POS Page
 * Main point of sale terminal interface
 */

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { User, Clock, PauseCircle, Receipt, Menu, AlertTriangle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/common";
import { useInventory } from "@/features/inventory";
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
import { useBranchStore } from "@/store/branchStore";
import { ROUTES } from "@/config";
import { toast } from "sonner";

const POSPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
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

  // Queries - fetch inventory data with real-time stock quantities
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory(
    selectedBranch?.id,
    { page: 0, size: 1000 } // Fetch all inventory items for POS
  );
  const { data: customersData } = useCustomers();
  const createSaleMutation = useCreateSale();

  // Transform products to ensure productId is always present
  const products = useMemo(() => {
    const rawProducts = inventoryData?.content || [];
    return rawProducts.map(product => ({
      ...product,
      // Ensure productId is present (use id as fallback, or extract from product object)
      productId: product.productId || product.id || product.product?.id,
      id: product.productId || product.id || product.product?.id,
    }));
  }, [inventoryData]);
  
  const customers = customersData?.content || customersData || [];
  
  // Debug log to check product structure
  useEffect(() => {
    if (products.length > 0) {
      console.log("POS Products loaded:", {
        count: products.length,
        firstProduct: products[0],
        hasProductId: !!products[0].productId,
        hasId: !!products[0].id,
      });
    }
  }, [products]);

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
    // Get branch ID from branch store
    const branchId = selectedBranch?.id;
    
    if (!branchId) {
      toast.error("No Branch Selected", {
        description: "Please select a branch from the header dropdown to complete the sale.",
      });
      return;
    }

    // Validate items
    if (!saleData.items || saleData.items.length === 0) {
      toast.error("Cart is Empty", {
        description: "Please add items to cart before checkout.",
      });
      return;
    }

    // Calculate total discount amount based on type
    const subtotal = saleData.subtotal || 0;
    const itemDiscountTotal = saleData.items.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const discount = item.discount || 0;
      return sum + (itemTotal * discount) / 100;
    }, 0);
    
    const afterItemDiscount = subtotal - itemDiscountTotal;
    
    // For cart-level discount: send either percentage or fixed amount
    const cartDiscountPercent = saleData.discount?.type === "percentage" 
      ? Number(saleData.discount.value) || 0
      : 0;
      
    const cartDiscountAmount = saleData.discount?.type === "fixed"
      ? Math.min(Number(saleData.discount.value) || 0, afterItemDiscount)
      : 0;

    // Validate all items have productId
    const invalidItems = saleData.items.filter(item => !item.productId);
    if (invalidItems.length > 0) {
      console.error("Items without productId:", invalidItems);
      toast.error("Invalid Cart Items", {
        description: "Some items in the cart are missing product information. Please remove and re-add them.",
      });
      return;
    }

    // Ensure paidAmount is valid
    const paidAmount = Number(saleData.payment?.amountTendered) || Number(saleData.grandTotal) || 0;

    if (paidAmount <= 0) {
      toast.error("Invalid Payment Amount", {
        description: "Please enter a valid payment amount.",
      });
      return;
    }

    const payload = {
      customerId: saleData.customer?.id || null,
      branchId: branchId,
      items: saleData.items.map((item) => {
        const itemTotal = item.unitPrice * item.quantity;
        const itemDiscount = item.discount || 0;
        return {
          productId: Number(item.productId),
          inventoryBatchId: item.batchId ? Number(item.batchId) : null,
          quantity: parseInt(item.quantity, 10),
          discountAmount: parseFloat((itemTotal * itemDiscount / 100).toFixed(2)),
        };
      }),
      discountAmount: parseFloat(cartDiscountAmount.toFixed(2)),
      discountPercent: parseFloat(cartDiscountPercent.toFixed(2)),
      paymentMethod: saleData.payment?.method || "CASH",
      paidAmount: parseFloat(paidAmount.toFixed(2)),
      patientName: saleData.customer?.name || null,
      doctorName: null,
      remarks: saleData.payment?.reference || null,
    };

    // Log simplified payload info for debugging
    console.log("Submitting sale:", {
      branchId: payload.branchId,
      itemCount: payload.items.length,
      totalAmount: payload.paidAmount,
      paymentMethod: payload.paymentMethod,
      items: payload.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    });

    try {
      const result = await createSaleMutation.mutateAsync(payload);
      console.log("Sale created successfully:", result);
      
      if (result) {
        setLastSale(result);
        setShowReceiptDialog(true);
        clearCart();
      }
    } catch (error) {
      console.error("Sale creation failed:", error);
      console.error("Error response:", error.response?.data);
      
      // Extract error information
      const errorData = error.response?.data;
      const errorStatus = errorData?.error || errorData?.status;
      const errorMessage = errorData?.message || "Failed to complete sale. Please try again.";
      
      // Handle field validation errors
      if (errorData?.fieldErrors) {
        const fieldErrorMessages = Object.entries(errorData.fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(", ");
        
        toast.error("Validation Error", {
          description: `Please check the following fields: ${fieldErrorMessages}`,
          duration: 8000,
        });
        return;
      }
      
      // Handle specific error types
      if (errorStatus === "Insufficient Stock" || errorMessage.includes("No available stock")) {
        const productName = errorMessage.match(/product: (.+)/)?.[1] || "product";
        toast.error("Insufficient Stock", {
          description: `${productName} is out of stock or has no available batches. Please check inventory or remove this item.`,
          duration: 5000,
        });
      } else if (errorData?.details || errorData?.errors) {
        toast.error("Sale Failed", {
          description: `${errorMessage}\n${JSON.stringify(errorData.details || errorData.errors)}`,
          duration: 5000,
        });
      } else {
        toast.error("Sale Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }
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
          {selectedBranch ? (
            <Badge variant="secondary" className="gap-1 hidden lg:flex">
              📍 {selectedBranch.branchName || selectedBranch.name}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1 hidden lg:flex">
              ⚠️ No Branch Selected
            </Badge>
          )}
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
          {/* Branch Warning Alert */}
          {!selectedBranch && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Branch Selected</AlertTitle>
              <AlertDescription>
                Please select a branch from the dropdown in the header to process sales.
              </AlertDescription>
            </Alert>
          )}

          {/* Product Search */}
          <POSProductSearch products={products} isLoading={inventoryLoading} />

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
            hasBranch={!!selectedBranch}
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
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Sale Complete!
            </DialogTitle>
          </DialogHeader>
          
          {lastSale && (
            <div id="thermal-receipt" className="thermal-receipt">
              {/* Pharmacy Header */}
              <div className="text-center mb-4 border-b-2 border-dashed border-gray-400 pb-3">
                <h1 className="text-lg font-bold uppercase">{selectedBranch?.name || "MEDLAN PHARMACY"}</h1>
                <p className="text-xs mt-1">{selectedBranch?.address || "Address Line 1"}</p>
                <p className="text-xs">{selectedBranch?.city || "City"}, {selectedBranch?.state || "State"}</p>
                <p className="text-xs">Phone: {selectedBranch?.phone || "044-12345678"}</p>
                {selectedBranch?.gstNumber && (
                  <p className="text-xs">GSTIN: {selectedBranch.gstNumber}</p>
                )}
              </div>

              {/* Invoice Details */}
              <div className="mb-3 text-center">
                <h2 className="text-base font-bold">RETAIL INVOICE</h2>
              </div>
              
              <div className="text-xs mb-3 space-y-1">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDateTime(lastSale.saleDate || new Date())}</span>
                </div>
                {lastSale.customer?.name && (
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{lastSale.customer.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Bill No:</span>
                  <span className="font-bold">{lastSale.saleNumber || lastSale.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span>{lastSale.paymentMethod || "Cash"}</span>
                </div>
                {user?.username && (
                  <div className="flex justify-between">
                    <span>Cashier:</span>
                    <span>{user.username}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2 mb-3">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="flex-1">Item</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="w-20 text-right">Amt</span>
                </div>
                {lastSale.items?.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="flex-1 font-medium">
                        {item.productName || item.product?.productName}
                      </span>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <span className="w-20 text-right">
                        {formatCurrency(item.totalAmount || (item.unitPrice * item.quantity))}
                      </span>
                    </div>
                    {item.batchNumber && (
                      <div className="text-xs text-gray-600 ml-1">
                        Batch: {item.batchNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="text-xs space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span className="font-medium">
                    {formatCurrency(lastSale.subtotal || lastSale.totalAmount)}
                  </span>
                </div>
                
                {lastSale.itemDiscountTotal > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>(-) Item Discount:</span>
                    <span>{formatCurrency(lastSale.itemDiscountTotal)}</span>
                  </div>
                )}
                
                {lastSale.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>(-) Discount {lastSale.discountPercent > 0 ? `@ ${lastSale.discountPercent}%` : ''}:</span>
                    <span>{formatCurrency(lastSale.discountAmount)}</span>
                  </div>
                )}
                
                {lastSale.cgstAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span>CGST @ {lastSale.cgstPercent || 0}%:</span>
                    <span>{formatCurrency(lastSale.cgstAmount)}</span>
                  </div>
                )}
                
                {lastSale.sgstAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span>SGST @ {lastSale.sgstPercent || 0}%:</span>
                    <span>{formatCurrency(lastSale.sgstAmount)}</span>
                  </div>
                )}
                
                {lastSale.igstAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span>IGST @ {lastSale.igstPercent || 0}%:</span>
                    <span>{formatCurrency(lastSale.igstAmount)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="border-t-2 border-dashed border-gray-400 pt-2 mb-3">
                <div className="flex justify-between text-base font-bold">
                  <span>TOTAL:</span>
                  <span>Rs {formatCurrency(lastSale.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="text-xs space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>{lastSale.paymentMethod || "Cash"}:</span>
                  <span>Rs {formatCurrency(lastSale.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash tendered:</span>
                  <span>Rs {formatCurrency(lastSale.paidAmount || lastSale.totalAmount)}</span>
                </div>
                {lastSale.change > 0 && (
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Change:</span>
                    <span>Rs {formatCurrency(lastSale.change)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-xs border-t-2 border-dashed border-gray-400 pt-3 mt-3">
                <p className="font-medium">Thank you for your purchase!</p>
                <p className="mt-1">Please visit again</p>
                {lastSale.remarks && (
                  <p className="mt-2 text-gray-600">{lastSale.remarks}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0 print:hidden">
            <Button
              variant="outline"
              onClick={() => setShowReceiptDialog(false)}
            >
              New Sale
            </Button>
            <Button onClick={() => window.print()}>
              <Receipt className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt,
          #thermal-receipt * {
            visibility: visible;
          }
          #thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
        
        .thermal-receipt {
          font-family: 'Courier New', monospace;
          max-width: 80mm;
          margin: 0 auto;
          padding: 10px;
          background: white;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default POSPage;
