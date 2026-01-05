/**
 * GRN Edit Page
 * Edit existing GRN to add/update batch information
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { PageHeader, LoadingSpinner } from "@/components/common";
import { useUpdateGRN, useGRN, GRNForm } from "@/features/grn";

const GRNEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Queries
  const { data: grn, isLoading } = useGRN(id);
  const updateMutation = useUpdateGRN();

  // Handle form submission
  const handleSubmit = (data) => {
    console.log('GRN Edit - Submitting data:', JSON.stringify(data, null, 2));
    
    // Validate that all items have received quantity > 0
    const hasInvalidQuantity = data.items.some(item => !item.receivedQuantity || item.receivedQuantity <= 0);
    if (hasInvalidQuantity) {
      console.error('GRN Edit - Some items have invalid quantity');
      return;
    }
    
    // Transform form data to match backend API
    const apiData = {
      supplierId: grn?.supplier?.id || grn?.supplierId,
      branchId: grn?.branch?.id || grn?.branchId,
      purchaseOrderId: grn?.purchaseOrder?.id || grn?.purchaseOrderId,
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
    
    console.log('GRN Edit - Transformed API data:', JSON.stringify(apiData, null, 2));
    
    updateMutation.mutate(
      { id: parseInt(id), data: apiData },
      {
        onSuccess: () => navigate(ROUTES.GRN.VIEW(id)),
      }
    );
  };

  const handleCancel = () => {
    navigate(ROUTES.GRN.VIEW(id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!grn) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">GRN not found.</p>
        <Button variant="link" onClick={() => navigate(ROUTES.GRN.ROOT)}>
          Back to GRN list
        </Button>
      </div>
    );
  }

  // Only allow editing PENDING, DRAFT, or RECEIVED status GRNs
  const allowedStatuses = ['PENDING', 'DRAFT', 'RECEIVED'];
  if (!allowedStatuses.includes(grn.status)) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          This GRN cannot be edited. Only GRNs with PENDING, DRAFT, or RECEIVED status can be modified.
        </p>
        <Button variant="link" onClick={() => navigate(ROUTES.GRN.VIEW(id))}>
          Back to GRN details
        </Button>
      </div>
    );
  }

  // Transform GRN data to match form structure
  const purchaseOrderData = {
    id: grn.purchaseOrder?.id || grn.purchaseOrderId,
    poNumber: grn.purchaseOrder?.poNumber || grn.poNumber,
    supplier: grn.supplier,
    branch: grn.branch,
    items: grn.items?.map(item => ({
      productId: item.product?.id || item.productId,
      productName: item.product?.productName || item.productName,
      quantityOrdered: item.receivedQuantity || item.quantity,
      quantity: item.receivedQuantity || item.quantity,
      unitPrice: item.unitPrice || item.costPrice,
    })) || []
  };

  // Pre-populate form with existing GRN data
  const initialData = {
    purchaseOrderId: grn.purchaseOrder?.id?.toString() || grn.purchaseOrderId?.toString(),
    receivedDate: grn.receivedDate,
    invoiceNumber: grn.supplierInvoiceNumber || "",
    invoiceDate: grn.supplierInvoiceDate || "",
    notes: grn.remarks || "",
    items: grn.items?.map(item => ({
      productId: item.product?.id?.toString() || item.productId?.toString(),
      productName: item.product?.productName || item.productName || "",
      orderedQuantity: item.receivedQuantity || item.quantity,
      receivedQuantity: item.receivedQuantity || item.quantity,
      rejectedQuantity: 0,
      unitPrice: item.unitPrice || item.costPrice || 0,
      batchNumber: item.batchNumber || "",
      manufacturingDate: item.manufacturingDate || "",
      expiryDate: item.expiryDate || "",
      sellingPrice: item.sellingPrice || 0,
      mrp: item.mrp || 0,
      notes: "",
    })) || []
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit GRN ${grn.grnNumber}`}
        description="Update batch information and item details"
        icon={Package}
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to GRN Details
          </Button>
        }
      />

      <GRNForm
        purchaseOrder={purchaseOrderData}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={updateMutation.isPending}
        isEditMode={true}
      />
    </div>
  );
};

export default GRNEditPage;
