/**
 * GRN View Page
 * Detailed view of a Goods Received Note
 */

import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Package, 
  CheckCircle, 
  Printer, 
  Undo2, 
  Edit, 
  AlertTriangle 
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
import { useGRN, useApproveGRN } from "@/features/grn";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { toast } from "sonner";

// Status badge configuration
const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
  RECEIVED: { label: "Received (Inventory Updated)", variant: "success" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  CANCELLED: { label: "Cancelled", variant: "secondary" },
};

const GRNViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Queries
  const { data: grn, isLoading } = useGRN(id);
  const approveMutation = useApproveGRN();

  const status = grn?.status;
  // Can approve (which updates inventory) if DRAFT or PENDING_APPROVAL
  const canApprove = status === "DRAFT" || status === "PENDING_APPROVAL";
  const canReturn = status === "RECEIVED";
  const canEdit = status === "DRAFT" || status === "PENDING_APPROVAL";

  // Calculate totals from items
  const items = grn?.items || [];
  const totalAmount = items.reduce(
    (sum, item) => sum + item.receivedQuantity * item.unitPrice,
    0
  );

  // Check if GRN has complete data for all items
  const hasCompleteData = items.every(item => 
    item.batchNumber && 
    item.manufacturingDate && 
    item.expiryDate && 
    item.sellingPrice && 
    item.mrp
  );

  const handleApprove = () => {
    // Validate that all items have required fields
    if (!hasCompleteData) {
      toast.error("This GRN has missing required fields. Redirecting to edit page...", {
        description: "Please fill in batch number, dates, selling price, and MRP for all items."
      });
      // Redirect to edit page after a short delay
      setTimeout(() => {
        navigate(ROUTES.GRN.EDIT(id));
      }, 1500);
      return;
    }
    
    // This will create inventory batches and update stock levels in the database
    approveMutation.mutate(id, {
      onSuccess: () => {
        // Success toast is handled by the hook
      }
    });
  };

  const handleEdit = () => {
    navigate(ROUTES.GRN.EDIT(id));
  };

  const handleCreateReturn = () => {
    navigate(`${ROUTES.RGRN.CREATE}?grnId=${id}`);
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

  const statusInfo = statusConfig[status] || {
    label: status,
    variant: "secondary",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`GRN ${grn.grnNumber}`}
        description={`Received on ${formatDate(grn.receivedDate)}`}
        icon={Package}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate(ROUTES.GRN.ROOT)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            {canEdit && (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit GRN
              </Button>
            )}
            {canApprove && (
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending || !hasCompleteData}
                title={!hasCompleteData ? "Cannot approve: some items have missing data" : "Approve GRN and update inventory"}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve & Update Inventory
              </Button>
            )}
            {canReturn && (
              <Button variant="outline" onClick={handleCreateReturn}>
                <Undo2 className="mr-2 h-4 w-4" />
                Create Return
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* GRN Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Receipt Details</CardTitle>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">GRN Number</p>
                <p className="font-medium font-mono">{grn.grnNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PO Number</p>
                <p className="font-medium font-mono">
                  {grn.purchaseOrder?.poNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received Date</p>
                <p className="font-medium">{formatDate(grn.receivedDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{grn.branch?.branchName || "-"}</p>
              </div>
              {grn.invoiceNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-medium">{grn.invoiceNumber}</p>
                </div>
              )}
              {grn.invoiceDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Date</p>
                  <p className="font-medium">{formatDate(grn.invoiceDate)}</p>
                </div>
              )}
            </div>
            {grn.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-1">{grn.notes}</p>
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
            <p className="font-medium">
              {grn.supplier?.name || grn.purchaseOrder?.supplier?.name || "-"}
            </p>
            {(grn.supplier?.phone || grn.purchaseOrder?.supplier?.phone) && (
              <p className="text-sm">
                {grn.supplier?.phone || grn.purchaseOrder?.supplier?.phone}
              </p>
            )}
            {(grn.supplier?.email || grn.purchaseOrder?.supplier?.email) && (
              <p className="text-sm">
                {grn.supplier?.email || grn.purchaseOrder?.supplier?.email}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Received Items */}
      <Card>
        <CardHeader>
          <CardTitle>Received Items</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasCompleteData && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 mb-2">
                    ⚠️ Incomplete GRN Data
                  </p>
                  <p className="text-sm text-amber-800 mb-3">
                    Some items are missing required information. Items with missing data are highlighted in red below.
                  </p>
                  {canEdit && (
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={handleEdit}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit GRN to Complete Missing Data
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Ordered</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Rejected</TableHead>
                <TableHead>Batch No.</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const lineTotal =
                  (item.receivedQuantity || 0) * (item.unitPrice || 0);
                const hasDiscrepancy =
                  item.receivedQuantity !== item.orderedQuantity;
                
                // Check which fields are missing
                const missingFields = [];
                if (!item.batchNumber) missingFields.push("Batch #");
                if (!item.manufacturingDate) missingFields.push("Mfg Date");
                if (!item.expiryDate) missingFields.push("Expiry");
                if (!item.sellingPrice || item.sellingPrice === 0) missingFields.push("Selling Price");
                if (!item.mrp || item.mrp === 0) missingFields.push("MRP");
                const isIncomplete = missingFields.length > 0;

                return (
                  <TableRow
                    key={item.id || index}
                    className={isIncomplete ? "bg-red-50 border-l-4 border-red-500" : hasDiscrepancy ? "bg-yellow-50" : ""}
                  >
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
                        {isIncomplete && (
                          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                            <p className="text-xs font-semibold text-red-900">
                              ⚠️ Missing required data
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                              Please add: {missingFields.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.orderedQuantity || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.receivedQuantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.rejectedQuantity > 0 ? (
                        <span className="text-destructive">
                          {item.rejectedQuantity}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.batchNumber ? (
                        item.batchNumber
                      ) : (
                        <span className="text-red-600 font-medium">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.expiryDate ? (
                        formatDate(item.expiryDate)
                      ) : (
                        <span className="text-red-600 font-medium">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(lineTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="font-bold">
                <TableCell colSpan={8} className="text-right">
                  Total Amount
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(grn.totalAmount || totalAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Info */}
      {(grn.verifiedBy || grn.completedBy) && (
        <Card>
          <CardHeader>
            <CardTitle>Processing History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {grn.verifiedBy && (
              <p>
                <span className="text-muted-foreground">Verified by:</span>{" "}
                {grn.verifiedBy.name || grn.verifiedBy} on{" "}
                {formatDate(grn.verifiedAt)}
              </p>
            )}
            {grn.completedBy && (
              <p>
                <span className="text-muted-foreground">Completed by:</span>{" "}
                {grn.completedBy.name || grn.completedBy} on{" "}
                {formatDate(grn.completedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GRNViewPage;
