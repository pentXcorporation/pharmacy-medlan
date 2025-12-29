/**
 * Sale View Page
 * Detailed view of a single sale
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Printer, Undo2, Ban } from "lucide-react";
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
} from "@/components/ui/table";
import { PageHeader, LoadingScreen } from "@/components/common";
import { useSale } from "@/features/sales";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { ROUTES } from "@/config";

// Status badge variants
const statusConfig = {
  COMPLETED: { label: "Completed", variant: "success" },
  VOIDED: { label: "Voided", variant: "destructive" },
  PARTIALLY_RETURNED: { label: "Partially Returned", variant: "warning" },
  RETURNED: { label: "Returned", variant: "secondary" },
};

const SaleViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: sale, isLoading } = useSale(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!sale) {
    return (
      <div className="container mx-auto py-6">
        <p>Sale not found</p>
      </div>
    );
  }

  const status = sale.status || "COMPLETED";
  const statusConfig1 = statusConfig[status] || statusConfig.COMPLETED;
  const isVoided = status === "VOIDED";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={`Invoice: ${sale.invoiceNumber}`}
        description={`Sale completed on ${formatDateTime(sale.createdAt)}`}
      >
        <div className="flex gap-2">
          {!isVoided && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`${ROUTES.SALES.RETURNS}/new?saleId=${sale.id}`)
                }
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Return
              </Button>
              <Button variant="outline">
                <Ban className="h-4 w-4 mr-2" />
                Void
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sale Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sale Details</CardTitle>
            <Badge variant={statusConfig1.variant}>{statusConfig1.label}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="font-medium">{sale.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{formatDateTime(sale.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cashier</p>
              <p className="font-medium">{sale.createdBy || "System"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{sale.customerName || "Walk-in"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <Badge variant="outline">{sale.paymentMethod}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p className="font-medium">{sale.branchName || "Main"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(sale.subtotal || sale.totalAmount)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(sale.discountAmount)}</span>
              </div>
            )}
            {sale.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(sale.taxAmount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
            {sale.amountTendered > 0 && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tendered</span>
                  <span>{formatCurrency(sale.amountTendered)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Change</span>
                  <span>{formatCurrency(sale.changeGiven)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Sale Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Returned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items?.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.batchNumber || "-"}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.discountPercent > 0
                      ? `${item.discountPercent}%`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(
                      item.totalPrice || item.unitPrice * item.quantity
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.returnedQuantity > 0 ? (
                      <Badge variant="warning">{item.returnedQuantity}</Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Void Info */}
      {isVoided && sale.voidReason && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Void Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Voided By</p>
              <p className="font-medium">{sale.voidedBy || "System"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voided At</p>
              <p className="font-medium">{formatDateTime(sale.voidedAt)}</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="font-medium">{sale.voidReason}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SaleViewPage;
