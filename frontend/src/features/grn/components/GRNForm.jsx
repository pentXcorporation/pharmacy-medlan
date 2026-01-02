/**
 * GRN Form Component
 * Form for creating GRN from Purchase Order
 */

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, AlertTriangle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonSpinner } from "@/components/common";
import { formatCurrency } from "@/utils/formatters";

// Line item schema
const lineItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  orderedQuantity: z.number(),
  receivedQuantity: z.number().min(1, "Received quantity must be at least 1"),
  rejectedQuantity: z.number().min(0).default(0),
  unitPrice: z.number().min(0.01, "Unit price must be greater than 0"),
  batchNumber: z.string().min(1, "Batch number is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  notes: z.string().optional(),
});

// Validation schema
const grnSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase order is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(lineItemSchema).min(1, "At least one item is required"),
});

/**
 * GRNForm component
 */
const GRNForm = ({
  purchaseOrder,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const form = useForm({
    resolver: zodResolver(grnSchema),
    defaultValues: {
      purchaseOrderId: purchaseOrder?.id?.toString() || "",
      receivedDate: new Date().toISOString().split("T")[0],
      invoiceNumber: "",
      invoiceDate: "",
      notes: "",
      items: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");

  // Populate form from PO items
  useEffect(() => {
    if (purchaseOrder?.items) {
      const grnItems = purchaseOrder.items.map((item) => ({
        productId: item.productId?.toString() || "",
        productName: item.product?.name || item.productName || "",
        orderedQuantity: item.quantityOrdered || item.quantity || 1,
        receivedQuantity: item.quantityOrdered || item.quantity || 1, // Default to ordered quantity
        rejectedQuantity: 0,
        unitPrice: item.unitPrice || 0,
        batchNumber: "",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 year from now
        notes: "",
      }));

      form.reset({
        purchaseOrderId: purchaseOrder.id?.toString() || "",
        receivedDate: new Date().toISOString().split("T")[0],
        invoiceNumber: "",
        invoiceDate: "",
        notes: "",
        items: grnItems,
      });
    }
  }, [purchaseOrder, form]);

  // Calculate totals
  const totalReceived = items.reduce(
    (sum, item) => sum + item.receivedQuantity * item.unitPrice,
    0
  );

  const hasDiscrepancies = items.some(
    (item) =>
      item.receivedQuantity !== item.orderedQuantity ||
      item.rejectedQuantity > 0
  );

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      totalAmount: totalReceived,
    });
  };

  if (!purchaseOrder) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No purchase order selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* PO Info */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order: {purchaseOrder.poNumber}</CardTitle>
            <CardDescription>
              Supplier: {purchaseOrder.supplier?.name || "-"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Receipt Details */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="receivedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Received Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Invoice No.</FormLabel>
                  <FormControl>
                    <Input placeholder="INV-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Discrepancy Warning */}
        {hasDiscrepancies && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              There are discrepancies between ordered and received quantities.
            </AlertDescription>
          </Alert>
        )}

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Received Items</CardTitle>
            <CardDescription>
              Enter the quantity received for each item. Add batch numbers and
              expiry dates for tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Product</TableHead>
                    <TableHead className="text-right w-[10%]">
                      Ordered
                    </TableHead>
                    <TableHead className="text-right w-[12%]">
                      Received
                    </TableHead>
                    <TableHead className="text-right w-[12%]">
                      Rejected
                    </TableHead>
                    <TableHead className="w-[15%]">Batch No.</TableHead>
                    <TableHead className="w-[12%]">Expiry</TableHead>
                    <TableHead className="text-right w-[14%]">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const item = items[index] || {};
                    const lineTotal = item.receivedQuantity * item.unitPrice;
                    const hasQtyMismatch =
                      item.receivedQuantity !== item.orderedQuantity;

                    return (
                      <TableRow
                        key={field.id}
                        className={hasQtyMismatch ? "bg-yellow-50" : ""}
                      >
                        <TableCell>
                          <span className="font-medium">
                            {item.productName}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.orderedQuantity}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={item.orderedQuantity}
                            className="w-full text-right"
                            {...form.register(
                              `items.${index}.receivedQuantity`,
                              { valueAsNumber: true }
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            className="w-full text-right"
                            {...form.register(
                              `items.${index}.rejectedQuantity`,
                              { valueAsNumber: true }
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="LOT123"
                            {...form.register(`items.${index}.batchNumber`)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            {...form.register(`items.${index}.expiryDate`)}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(lineTotal)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4">
              <div className="w-[200px] space-y-2">
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalReceived)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this delivery..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <ButtonSpinner />}
            Create GRN
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GRNForm;
