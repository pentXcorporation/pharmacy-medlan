/**
 * Purchase Order Form Component
 * Form for creating and editing purchase orders
 */

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Search } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ButtonSpinner } from "@/components/common";
import { formatCurrency } from "@/utils/formatters";

// Line item schema
const lineItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  productName: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  discount: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
});

// Validation schema
const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDate: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(lineItemSchema).min(1, "At least one item is required"),
});

/**
 * PurchaseOrderForm component
 */
const PurchaseOrderForm = ({
  purchaseOrder,
  suppliers = [],
  products = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  onProductSearch,
}) => {
  const isEditing = Boolean(purchaseOrder);
  const [productSearch, setProductSearch] = useState("");

  const form = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: "",
      notes: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");

  // Populate form when editing
  useEffect(() => {
    if (purchaseOrder) {
      form.reset({
        supplierId: purchaseOrder.supplierId?.toString() || "",
        orderDate: purchaseOrder.orderDate?.split("T")[0] || "",
        expectedDate: purchaseOrder.expectedDate?.split("T")[0] || "",
        notes: purchaseOrder.notes || "",
        items:
          purchaseOrder.items?.map((item) => ({
            productId: item.productId?.toString() || "",
            productName: item.productName || item.product?.name || "",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            discount: item.discount || 0,
            taxRate: item.taxRate || 0,
          })) || [],
      });
    }
  }, [purchaseOrder, form]);

  // Calculate totals
  const calculateLineTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (item.taxRate / 100);
    return afterDiscount + taxAmount;
  };

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
  const grandTotal = subtotal - totalDiscount + totalTax;

  // Add product to order
  const handleAddProduct = (product) => {
    const exists = fields.find((f) => f.productId === product.id?.toString());
    if (exists) {
      // Increment quantity if already exists
      const index = fields.findIndex(
        (f) => f.productId === product.id?.toString()
      );
      const currentQty = form.getValues(`items.${index}.quantity`);
      form.setValue(`items.${index}.quantity`, currentQty + 1);
    } else {
      append({
        productId: product.id?.toString(),
        productName: product.name,
        quantity: 1,
        unitPrice: product.costPrice || product.purchasePrice || 0,
        discount: 0,
        taxRate: product.taxRate || 0,
      });
    }
    setProductSearch("");
  };

  // Filter products based on search
  const filteredProducts = products
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearch.toLowerCase())
    )
    .slice(0, 10);

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      totalAmount: grandTotal,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Header Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Supplier *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={supplier.id?.toString()}
                        >
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Delivery</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Product Search */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Products */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
              {productSearch && filteredProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex justify-between"
                      onClick={() => handleAddProduct(product)}
                    >
                      <span>{product.name}</span>
                      <span className="text-muted-foreground">
                        {product.sku}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items Table */}
            {fields.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount %</TableHead>
                      <TableHead className="text-right">Tax %</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = items[index] || {};
                      const lineTotal = calculateLineTotal(item);

                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <span className="font-medium">
                              {item.productName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              className="w-20 text-right"
                              {...form.register(`items.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              className="w-24 text-right"
                              {...form.register(`items.${index}.unitPrice`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step={0.1}
                              className="w-20 text-right"
                              {...form.register(`items.${index}.discount`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step={0.1}
                              className="w-20 text-right"
                              {...form.register(`items.${index}.taxRate`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(lineTotal)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mb-2" />
                <p>No items added. Search and add products above.</p>
              </div>
            )}

            {/* Totals */}
            {fields.length > 0 && (
              <div className="flex justify-end">
                <div className="w-[300px] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Discount</span>
                    <span>-{formatCurrency(totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>+{formatCurrency(totalTax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}
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
                      placeholder="Add any notes or special instructions..."
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
          <Button type="submit" disabled={isSubmitting || fields.length === 0}>
            {isSubmitting && <ButtonSpinner />}
            {isEditing ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PurchaseOrderForm;
