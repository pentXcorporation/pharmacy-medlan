/**
 * Purchase Order Form Page
 * Create or edit a purchase order
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { PageHeader, LoadingSpinner } from "@/components/common";
import {
  usePurchaseOrder,
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  PurchaseOrderForm,
} from "@/features/purchase-orders";
import { useActiveSuppliers } from "@/features/suppliers";
import { useProducts } from "@/features/products";
import { useBranchStore } from "@/store";

const PurchaseOrderFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { selectedBranch } = useBranchStore();

  // Queries
  const { data: purchaseOrder, isLoading: isPOLoading } = usePurchaseOrder(id);
  const { data: suppliersData, isLoading: isSuppliersLoading } = useActiveSuppliers();
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ pageSize: 500 });

  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();

  const suppliers = suppliersData || [];

  // Debug: Log suppliers data
  console.log('PO Form - Suppliers data:', suppliersData);
  console.log('PO Form - Is loading suppliers:', isSuppliersLoading);
  console.log('PO Form - Suppliers array:', suppliers);
  
  // Debug: Log products data
  console.log('PO Form - Products data:', productsData);
  console.log('PO Form - Is loading products:', isProductsLoading);
  
  const products = productsData?.content || productsData || [];
  console.log('PO Form - Products array:', products);
  console.log('PO Form - Products array length:', products?.length);
  
  const isLoading = isEditing && isPOLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handle form submission
  const handleSubmit = (data) => {
    console.log('PO Form - Submitting data:', JSON.stringify(data, null, 2));
    
    // Transform form data to match backend API
    const apiData = {
      supplierId: parseInt(data.supplierId),
      branchId: selectedBranch?.id,
      expectedDeliveryDate: data.expectedDate || null,
      remarks: data.notes || null,
      items: data.items.map(item => ({
        productId: parseInt(item.productId),
        quantityOrdered: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        discountPercent: parseFloat(item.discount || 0),
        gstRate: parseFloat(item.taxRate || 0),
        remarks: null
      }))
    };
    
    console.log('PO Form - Transformed API data:', JSON.stringify(apiData, null, 2));
    
    if (isEditing) {
      updateMutation.mutate(
        { id, data: apiData },
        { onSuccess: () => navigate(ROUTES.PURCHASE_ORDERS.ROOT) }
      );
    } else {
      createMutation.mutate(apiData, {
        onSuccess: () => navigate(ROUTES.PURCHASE_ORDERS.ROOT),
      });
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PURCHASE_ORDERS.ROOT);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Purchase Order" : "New Purchase Order"}
        description={
          isEditing
            ? "Update purchase order details"
            : "Create a new purchase order for a supplier"
        }
        icon={ShoppingCart}
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        }
      />

      <PurchaseOrderForm
        purchaseOrder={purchaseOrder}
        suppliers={suppliers}
        products={products}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PurchaseOrderFormPage;
