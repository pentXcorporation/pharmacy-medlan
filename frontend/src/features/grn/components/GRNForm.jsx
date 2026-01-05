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
  manufacturingDate: z.string().min(1, "Manufacturing date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  sellingPrice: z.number().min(0.01, "Selling price is required"),
  mrp: z.number().min(0.01, "MRP is required"),
  notes: z.string().optional(),
}).refine((data) => {
  // Validate expiry date is after manufacturing date
  if (data.manufacturingDate && data.expiryDate) {
    return new Date(data.expiryDate) > new Date(data.manufacturingDate);
  }
  return true;
}, {
  message: "Expiry date must be after manufacturing date",
  path: ["expiryDate"],
}).refine((data) => {
  // Validate MRP is greater than or equal to selling price
  if (data.mrp && data.sellingPrice) {
    return data.mrp >= data.sellingPrice;
  }
  return true;
}, {
  message: "MRP must be greater than or equal to selling price",
  path: ["mrp"],
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
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEditMode = false,
}) => {
  const form = useForm({
    resolver: zodResolver(grnSchema),
    defaultValues: initialData || {
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

  // Populate form from PO items (only if not in edit mode)
  useEffect(() => {
    if (purchaseOrder?.items && !isEditMode) {
      const grnItems = purchaseOrder.items.map((item) => ({
        productId: item.productId?.toString() || "",
        productName: item.product?.name || item.productName || "",
        orderedQuantity: item.quantityOrdered || item.quantity || 1,
        receivedQuantity: item.quantityOrdered || item.quantity || 1, // Default to ordered quantity
        rejectedQuantity: 0,
        unitPrice: item.unitPrice || 0,
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
        sellingPrice: 0,
        mrp: 0,
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
  }, [purchaseOrder, form, isEditMode]);

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

        {/* Edit Mode - Incomplete Data Warning */}
        {isEditMode && items.some(item => 
          !item.batchNumber || !item.manufacturingDate || !item.expiryDate || 
          !item.sellingPrice || item.sellingPrice === 0 || !item.mrp || item.mrp === 0
        ) && (
          <Alert variant="warning" className="bg-amber-50 border-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <strong>Action Required:</strong> Items highlighted in red are missing required information. 
              Please fill in all required fields (Batch Number, Manufacturing Date, Expiry Date, Selling Price, and MRP) before saving.
            </AlertDescription>
          </Alert>
        )}

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Received Items</CardTitle>
            <CardDescription>
              {isEditMode ? (
                <span className="text-amber-700 font-medium">
                  ⚠️ Please complete all missing fields marked with * before saving. Incomplete items are highlighted.
                </span>
              ) : (
                <span>
                  All fields marked with * are required. You must enter batch number, manufacturing date, expiry date, selling price, and MRP for each item before saving.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Product</TableHead>
                    <TableHead className="text-right w-[8%]">
                      Ordered
                    </TableHead>
                    <TableHead className="text-right w-[8%]">
                      Received
                    </TableHead>
                    <TableHead className="w-[12%]">Batch No. *</TableHead>
                    <TableHead className="w-[10%]">Mfg Date *</TableHead>
                    <TableHead className="w-[10%]">Expiry *</TableHead>
                    <TableHead className="text-right w-[10%]">Selling Price *</TableHead>
                    <TableHead className="text-right w-[10%]">MRP *</TableHead>
                    <TableHead className="text-right w-[12%]">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const item = items[index] || {};
                    const lineTotal = item.receivedQuantity * item.unitPrice;
                    const hasQtyMismatch =
                      item.receivedQuantity !== item.orderedQuantity;
                    
                    // Check for missing required fields
                    const isMissingData = isEditMode && (
                      !item.batchNumber || 
                      !item.manufacturingDate || 
                      !item.expiryDate || 
                      !item.sellingPrice || 
                      item.sellingPrice === 0 ||
                      !item.mrp || 
                      item.mrp === 0
                    );

                    return (
                      <TableRow
                        key={field.id}
                        className={
                          isMissingData 
                            ? "bg-red-50 border-l-4 border-red-500" 
                            : hasQtyMismatch 
                            ? "bg-yellow-50" 
                            : ""
                        }
                      >
                        <TableCell>
                          <div>
                            <span className="font-medium">
                              {item.productName}
                            </span>
                            {isMissingData && (
                              <p className="text-xs text-red-600 mt-1 font-medium">
                                ⚠️ Complete all required fields
                              </p>
                            )}
                          </div>
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
                            placeholder="LOT123"
                            className="w-full"
                            {...form.register(`items.${index}.batchNumber`)}
                          />
                          {form.formState.errors.items?.[index]?.batchNumber && (
                            <p className="text-xs text-red-500 mt-1">
                              {form.formState.errors.items[index].batchNumber.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            className="w-full"
                            {...form.register(`items.${index}.manufacturingDate`)}
                          />
                          {form.formState.errors.items?.[index]?.manufacturingDate && (
                            <p className="text-xs text-red-500 mt-1">
                              {form.formState.errors.items[index].manufacturingDate.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            className="w-full"
                            {...form.register(`items.${index}.expiryDate`)}
                          />
                          {form.formState.errors.items?.[index]?.expiryDate && (
                            <p className="text-xs text-red-500 mt-1">
                              {form.formState.errors.items[index].expiryDate.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            className="w-full text-right"
                            placeholder="0.00"
                            {...form.register(
                              `items.${index}.sellingPrice`,
                              { valueAsNumber: true }
                            )}
                          />
                          {form.formState.errors.items?.[index]?.sellingPrice && (
                            <p className="text-xs text-red-500 mt-1">
                              {form.formState.errors.items[index].sellingPrice.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            className="w-full text-right"
                            placeholder="0.00"
                            {...form.register(
                              `items.${index}.mrp`,
                              { valueAsNumber: true }
                            )}
                          />
                          {form.formState.errors.items?.[index]?.mrp && (
                            <p className="text-xs text-red-500 mt-1">
                              {form.formState.errors.items[index].mrp.message}
                            </p>
                          )}
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
            {isEditMode ? "Save Changes" : "Create GRN"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GRNForm;
