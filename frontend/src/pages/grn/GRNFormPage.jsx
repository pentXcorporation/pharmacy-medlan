/**
 * GRN Form Page
 * Create GRN from Purchase Order
 */

import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, LoadingSpinner } from "@/components/common";
import { useCreateGRN, GRNForm } from "@/features/grn";
import {
  usePurchaseOrder,
  usePendingPurchaseOrders,
} from "@/features/purchase-orders";
import { useState, useEffect } from "react";

const GRNFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const poIdFromUrl = searchParams.get("poId");
  const [selectedPOId, setSelectedPOId] = useState(poIdFromUrl || "");

  // Queries
  const { data: pendingPOs, isLoading: isLoadingPOs } =
    usePendingPurchaseOrders();
  const { data: selectedPO, isLoading: isLoadingPO } =
    usePurchaseOrder(selectedPOId);

  const createMutation = useCreateGRN();

  // Debug: Log the pending POs data
  console.log('GRN Form - Pending POs:', pendingPOs);
  console.log('GRN Form - Is loading POs:', isLoadingPOs);

  const approvedPOs = (pendingPOs || []).filter(
    (po) =>
      po.status === "APPROVED" ||
      po.status === "ORDERED" ||
      po.status === "PARTIALLY_RECEIVED"
  );

  console.log('GRN Form - Approved POs after filter:', approvedPOs);
  console.log('GRN Form - Approved POs count:', approvedPOs.length);

  // Set selected PO from URL
  useEffect(() => {
    if (poIdFromUrl) {
      setSelectedPOId(poIdFromUrl);
    }
  }, [poIdFromUrl]);

  // Handle form submission
  const handleSubmit = (data) => {
    console.log('GRN Form - Submitting data:', JSON.stringify(data, null, 2));
    
    // Validate that all items have received quantity > 0
    const hasInvalidQuantity = data.items.some(item => !item.receivedQuantity || item.receivedQuantity <= 0);
    if (hasInvalidQuantity) {
      console.error('GRN Form - Some items have invalid quantity');
      return;
    }
    
    // Transform form data to match backend API
    const apiData = {
      supplierId: selectedPO?.supplier?.id || selectedPO?.supplierId,
      branchId: selectedPO?.branch?.id || selectedPO?.branchId,
      purchaseOrderId: parseInt(data.purchaseOrderId),
      receivedDate: data.receivedDate,
      supplierInvoiceNumber: data.invoiceNumber || null,
      supplierInvoiceDate: data.invoiceDate || null,
      remarks: data.notes || null,
      items: data.items
        .filter(item => item.receivedQuantity > 0) // Only include items with quantity > 0
        .map(item => ({
          productId: parseInt(item.productId),
          batchNumber: item.batchNumber,
          quantity: parseInt(item.receivedQuantity),
          costPrice: parseFloat(item.unitPrice),
          sellingPrice: parseFloat(item.sellingPrice),
          mrp: parseFloat(item.mrp),
          manufacturingDate: item.manufacturingDate,
          expiryDate: item.expiryDate,
          discountAmount: 0,
        }))
    };
    
    console.log('GRN Form - Transformed API data:', JSON.stringify(apiData, null, 2));
    
    createMutation.mutate(apiData, {
      onSuccess: () => navigate(ROUTES.GRN.ROOT),
    });
  };

  const handleCancel = () => {
    navigate(ROUTES.GRN.ROOT);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Goods Received Note"
        description="Record goods received from a supplier"
        icon={Package}
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to GRN List
          </Button>
        }
      />

      {/* PO Selection */}
      {!selectedPOId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Purchase Order</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPOs ? (
              <LoadingSpinner />
            ) : approvedPOs.length === 0 ? (
              <p className="text-muted-foreground">
                No approved purchase orders available. Create and approve a PO
                first.
              </p>
            ) : (
              <Select value={selectedPOId} onValueChange={setSelectedPOId}>
                <SelectTrigger className="w-full md:w-[400px]">
                  <SelectValue placeholder="Select a purchase order..." />
                </SelectTrigger>
                <SelectContent>
                  {approvedPOs.map((po) => (
                    <SelectItem key={po.id} value={po.id?.toString()}>
                      {po.poNumber} - {po.supplier?.name || "Unknown Supplier"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      )}

      {/* GRN Form */}
      {selectedPOId && (
        <>
          {isLoadingPO ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <GRNForm
              purchaseOrder={selectedPO}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={createMutation.isPending}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GRNFormPage;
