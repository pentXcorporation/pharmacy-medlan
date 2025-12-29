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

const PurchaseOrderFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Queries
  const { data: purchaseOrder, isLoading: isPOLoading } = usePurchaseOrder(id);
  const { data: suppliersData } = useActiveSuppliers();
  const { data: productsData } = useProducts({ pageSize: 500 });

  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();

  const suppliers = suppliersData || [];
  const products = productsData?.content || productsData || [];
  const isLoading = isEditing && isPOLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handle form submission
  const handleSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(
        { id, data },
        { onSuccess: () => navigate(ROUTES.PURCHASE_ORDERS.ROOT) }
      );
    } else {
      createMutation.mutate(data, {
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
