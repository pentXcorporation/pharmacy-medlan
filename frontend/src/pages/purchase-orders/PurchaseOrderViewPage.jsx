/**
 * Purchase Order View Page
 * Detailed view of a purchase order
 */

import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Send,
  CheckCircle,
  XCircle,
  Package,
  Edit,
  Printer,
} from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { PageHeader, LoadingSpinner } from "@/components/common";
import {
  usePurchaseOrder,
  useSubmitPurchaseOrder,
  useApprovePurchaseOrder,
  useCancelPurchaseOrder,
} from "@/features/purchase-orders";
import { usePermissions } from "@/hooks";
import { formatDate, formatCurrency } from "@/utils/formatters";

// Status badge configuration
const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
  APPROVED: { label: "Approved", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  ORDERED: { label: "Ordered", variant: "outline" },
  PARTIALLY_RECEIVED: { label: "Partially Received", variant: "warning" },
  RECEIVED: { label: "Fully Received", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "secondary" },
};

const PurchaseOrderViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { hasPermission } = usePermissions();

  // Queries
  const { data: po, isLoading } = usePurchaseOrder(id);
  const submitMutation = useSubmitPurchaseOrder();
  const approveMutation = useApprovePurchaseOrder();
  const cancelMutation = useCancelPurchaseOrder();

  const status = po?.status;
  
  // Permission checks combined with status checks
  // Note: SUPER_ADMIN creates orders directly as APPROVED, so they won't see DRAFT status
  const canEdit = status === "DRAFT" && hasPermission("purchaseOrders", "edit");
  const canSubmit = status === "DRAFT" && hasPermission("purchaseOrders", "edit");
  const canApprove = status === "PENDING_APPROVAL" && hasPermission("purchaseOrders", "approve");
  const canReceive = (status === "APPROVED" || status === "ORDERED") && hasPermission("grn", "create");
  const canCancel = (status === "DRAFT" || status === "PENDING_APPROVAL") && hasPermission("purchaseOrders", "edit");

  // Calculate totals from items
  const items = po?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalDiscount = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + itemSubtotal * (item.discount / 100);
  }, 0);
  const totalTax = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const afterDiscount = itemSubtotal - itemSubtotal * (item.discount / 100);
    return sum + afterDiscount * (item.taxRate / 100);
  }, 0);

  const handleSubmit = () => {
    submitMutation.mutate(id);
  };

  const handleApprove = () => {
    approveMutation.mutate(id);
  };

  const handleCancel = () => {
    cancelMutation.mutate(id);
  };

  const handleReceive = () => {
    navigate(`${ROUTES.GRN.CREATE}?poId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!po) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Purchase order not found.</p>
        <Button
          variant="link"
          onClick={() => navigate(ROUTES.PURCHASE_ORDERS.ROOT)}
        >
          Back to orders
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[status] || {
    label: status,
    variant: "secondary",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Purchase Order ${po.poNumber}`}
        description={`Created on ${formatDate(po.createdAt)}`}
        icon={ShoppingCart}
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.PURCHASE_ORDERS.ROOT)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.PURCHASE_ORDERS.EDIT(id))}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {canSubmit && (
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit for Approval
              </Button>
            )}
            {canApprove && (
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
            {canReceive && (
              <Button onClick={handleReceive}>
                <Package className="mr-2 h-4 w-4" />
                Receive
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Details</CardTitle>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">PO Number</p>
                <p className="font-medium font-mono">{po.poNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{formatDate(po.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected Delivery
                </p>
                <p className="font-medium">
                  {formatDate(po.expectedDeliveryDate) || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{po.branch?.branchName || "-"}</p>
              </div>
            </div>
            {po.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-1">{po.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Supplier Info */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{po.supplierName || "-"}</p>
            {po.supplier?.contactPerson && (
              <p className="text-sm text-muted-foreground">
                {po.supplier.contactPerson}
              </p>
            )}
            {po.supplier?.phone && (
              <p className="text-sm">{po.supplier.phone}</p>
            )}
            {po.supplier?.email && (
              <p className="text-sm">{po.supplier.email}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const itemSubtotal = item.quantity * item.unitPrice;
                const discountAmount =
                  itemSubtotal * ((item.discount || 0) / 100);
                const afterDiscount = itemSubtotal - discountAmount;
                const taxAmount = afterDiscount * ((item.taxRate || 0) / 100);
                const lineTotal = afterDiscount + taxAmount;

                return (
                  <TableRow key={item.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {item.product?.name || item.productName}
                        </p>
                        {item.product?.sku && (
                          <p className="text-sm text-muted-foreground">
                            {item.product.sku}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.discount || 0}%
                    </TableCell>
                    <TableCell className="text-right">
                      {item.taxRate || 0}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(lineTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-right">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(subtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-right text-muted-foreground"
                >
                  Discount
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  -{formatCurrency(totalDiscount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-right text-muted-foreground"
                >
                  Tax
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  +{formatCurrency(totalTax)}
                </TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell colSpan={6} className="text-right">
                  Grand Total
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(po.totalAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Info */}
      {(po.approvedBy || po.rejectedBy) && (
        <Card>
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {po.approvedBy && (
              <p>
                <span className="text-muted-foreground">Approved by:</span>{" "}
                {po.approvedBy.name || po.approvedBy} on{" "}
                {formatDate(po.approvedAt)}
              </p>
            )}
            {po.rejectedBy && (
              <>
                <p>
                  <span className="text-muted-foreground">Rejected by:</span>{" "}
                  {po.rejectedBy.name || po.rejectedBy} on{" "}
                  {formatDate(po.rejectedAt)}
                </p>
                {po.rejectionReason && (
                  <p>
                    <span className="text-muted-foreground">Reason:</span>{" "}
                    {po.rejectionReason}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchaseOrderViewPage;
