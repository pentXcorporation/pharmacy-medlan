/**
 * Direct GRN Form Page
 * Create GRN without Purchase Order (Direct Purchase)
 */

import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Package, Plus, Trash2 } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { PageHeader, LoadingSpinner, ButtonSpinner } from "@/components/common";
import { useCreateGRN } from "@/features/grn";
import { useActiveSuppliers } from "@/features/suppliers";
import { useProducts } from "@/features/products";
import { useBranchStore } from "@/store/branchStore";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatters";

// Validation schema
const grnItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  costPrice: z.number().min(0.01, "Cost price is required"),
  sellingPrice: z.number().min(0.01, "Selling price is required"),
  manufacturingDate: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  discountAmount: z.number().min(0).default(0),
});

const directGRNSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  branchId: z.number().min(1, "Branch is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  supplierInvoiceNumber: z.string().optional(),
  supplierInvoiceDate: z.string().optional(),
  remarks: z.string().max(1000).optional(),
  items: z.array(grnItemSchema).min(1, "At least one item is required"),
});

const DirectGRNFormPage = () => {
  const navigate = useNavigate();
  const selectedBranch = useBranchStore((state) => state.selectedBranch);

  // Queries
  const { data: suppliers, isLoading: isLoadingSuppliers } = useActiveSuppliers();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ size: 1000 });
  const createMutation = useCreateGRN();

  const products = productsData?.content || [];

  // Debug: Log suppliers data
  console.log("Suppliers data:", suppliers);
  console.log("Is loading suppliers:", isLoadingSuppliers);

  const form = useForm({
    resolver: zodResolver(directGRNSchema),
    defaultValues: {
      supplierId: "",
      branchId: selectedBranch?.id || 0,
      receivedDate: new Date().toISOString().split("T")[0],
      supplierInvoiceNumber: "",
      supplierInvoiceDate: "",
      remarks: "",
      items: [
        {
          productId: "",
          batchNumber: "",
          quantity: 1,
          costPrice: 0,
          sellingPrice: 0,
          manufacturingDate: "",
          expiryDate: "",
          discountAmount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = useWatch({
    control: form.control,
    name: "items",
    defaultValue: [],
  });

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.costPrice;
    const discount = item.discountAmount || 0;
    return sum + (itemTotal - discount);
  }, 0);

  const handleSubmit = (data) => {
    if (!selectedBranch?.id) {
      toast.error("Please select a branch");
      return;
    }

    const payload = {
      supplierId: parseInt(data.supplierId),
      branchId: selectedBranch.id,
      purchaseOrderId: null, // Direct purchase
      receivedDate: data.receivedDate,
      supplierInvoiceNumber: data.supplierInvoiceNumber || null,
      supplierInvoiceDate: data.supplierInvoiceDate || null,
      remarks: data.remarks || null,
      items: data.items.map((item) => ({
        productId: parseInt(item.productId),
        batchNumber: item.batchNumber,
        quantity: item.quantity,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        manufacturingDate: item.manufacturingDate || null,
        expiryDate: item.expiryDate,
        discountAmount: item.discountAmount || 0,
      })),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Stock added successfully!");
        navigate(ROUTES.GRN.ROOT);
      },
      onError: (error) => {
        toast.error("Failed to add stock", {
          description: error.response?.data?.message || "Please try again",
        });
      },
    });
  };

  const handleCancel = () => {
    navigate(ROUTES.GRN.ROOT);
  };

  const addItem = () => {
    append({
      productId: "",
      batchNumber: "",
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      manufacturingDate: "",
      expiryDate: "",
      discountAmount: 0,
    });
  };

  if (isLoadingSuppliers || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Direct Stock Receipt"
        description="Add stock without a purchase order"
        icon={Package}
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to GRN List
          </Button>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Receipt Information</CardTitle>
              <CardDescription>
                Enter details about the stock receipt
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id?.toString()}
                          >
                            {supplier.supplierName || supplier.name}
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
                name="supplierInvoiceNumber"
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
                name="supplierInvoiceDate"
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

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes..."
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Items</CardTitle>
                  <CardDescription>
                    Add products with batch and pricing information
                  </CardDescription>
                </div>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Product *</TableHead>
                      <TableHead className="w-[150px]">Batch No. *</TableHead>
                      <TableHead className="w-[100px]">Qty *</TableHead>
                      <TableHead className="w-[120px]">Cost Price *</TableHead>
                      <TableHead className="w-[120px]">Selling Price *</TableHead>
                      <TableHead className="w-[130px]">Mfg. Date</TableHead>
                      <TableHead className="w-[130px]">Expiry Date *</TableHead>
                      <TableHead className="w-[100px]">Discount</TableHead>
                      <TableHead className="w-[100px] text-right">Total</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = items[index] || {};
                      const lineTotal =
                        (item.quantity || 0) * (item.costPrice || 0) -
                        (item.discountAmount || 0);

                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.productId`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {products.map((product) => (
                                        <SelectItem
                                          key={product.id}
                                          value={product.id?.toString()}
                                        >
                                          {product.productName || product.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="BATCH-001"
                              {...form.register(`items.${index}.batchNumber`)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              {...form.register(`items.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              {...form.register(`items.${index}.costPrice`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              {...form.register(`items.${index}.sellingPrice`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              {...form.register(
                                `items.${index}.manufacturingDate`
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              {...form.register(`items.${index}.expiryDate`)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              {...form.register(`items.${index}.discountAmount`, {
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
                              disabled={fields.length === 1}
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

              {/* Total */}
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="min-w-[200px]"
                >
                  {createMutation.isPending ? (
                    <>
                      <ButtonSpinner />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Add Stock to Inventory
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default DirectGRNFormPage;
