/**
 * Direct Stock Form Component
 * Add stock directly to inventory without GRN process
 */

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ButtonSpinner } from "@/components/common";
import { useCreateGRN } from "@/features/grn";
import { useActiveSuppliers } from "@/features/suppliers";
import { useProducts } from "@/features/products";
import { useBranch } from "@/hooks";
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

const DirectStockForm = ({ onSuccess }) => {
  const { selectedBranch } = useBranch();

  // Queries
  const { data: suppliers, isLoading: isLoadingSuppliers } = useActiveSuppliers();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    size: 1000,
  });
  const createMutation = useCreateGRN();

  const products = productsData?.content || [];

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

  const items = useWatch({ control: form.control, name: "items" });

  // Calculate totals
  const calculateItemTotal = (item) => {
    const quantity = Number(item.quantity) || 0;
    const costPrice = Number(item.costPrice) || 0;
    const discount = Number(item.discountAmount) || 0;
    return quantity * costPrice - discount;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  const totalDiscount = items.reduce(
    (sum, item) => sum + (Number(item.discountAmount) || 0),
    0
  );
  const grandTotal = subtotal;

  const onSubmit = async (data) => {
    try {
      // Transform items - remove empty fields and convert to numbers
      const transformedData = {
        ...data,
        items: data.items.map((item) => ({
          productId: parseInt(item.productId),
          batchNumber: item.batchNumber,
          quantity: Number(item.quantity),
          costPrice: Number(item.costPrice),
          sellingPrice: Number(item.sellingPrice),
          manufacturingDate: item.manufacturingDate || null,
          expiryDate: item.expiryDate,
          discountAmount: Number(item.discountAmount) || 0,
        })),
        supplierId: parseInt(data.supplierId),
      };

      await createMutation.mutateAsync(transformedData);
      toast.success("Stock added successfully to inventory");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to add stock:", error);
      toast.error(
        error.response?.data?.message || "Failed to add stock to inventory"
      );
    }
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
      <div className="flex items-center justify-center p-8">
        <ButtonSpinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Please select a branch first
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Header Information */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers?.map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.id.toString()}
                      >
                        {supplier.supplierName}
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
                <FormLabel>Supplier Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV-12345" {...field} />
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
                <FormLabel>Supplier Invoice Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Items Table */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-medium">Items</h3>
            <Button type="button" size="sm" onClick={addItem}>
              <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add Item</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="border rounded-lg overflow-x-auto shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[200px] text-xs sm:text-sm font-semibold">Product *</TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:text-sm font-semibold">Batch Number *</TableHead>
                  <TableHead className="w-[100px] text-xs sm:text-sm font-semibold">Qty *</TableHead>
                  <TableHead className="w-[120px] text-xs sm:text-sm font-semibold">Cost Price *</TableHead>
                  <TableHead className="w-[120px] text-xs sm:text-sm font-semibold">Sell Price *</TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:text-sm font-semibold">MFG Date</TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:text-sm font-semibold">Expiry Date *</TableHead>
                  <TableHead className="w-[100px] text-xs sm:text-sm font-semibold">Discount</TableHead>
                  <TableHead className="w-[120px] text-xs sm:text-sm font-semibold">Total</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                                    value={product.id.toString()}
                                  >
                                    {product.productName}
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
                      <FormField
                        control={form.control}
                        name={`items.${index}.batchNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="BATCH-001" className="h-9 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                className="h-9 text-sm"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.costPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="h-9 text-sm"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.sellingPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="h-9 text-sm"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.manufacturingDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" className="h-9 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.expiryDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" className="h-9 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.discountAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="h-9 text-sm"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(calculateItemTotal(items[index]))}
                      </span>
                    </TableCell>
                    <TableCell>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:max-w-sm space-y-2 bg-muted/30 p-4 rounded-lg border">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Total Discount:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2 mt-2">
              <span>Grand Total:</span>
              <span className="text-primary">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or comments..."
                  className="min-h-[80px] sm:min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-2 border-t">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            size="lg"
            className="w-full sm:w-auto"
          >
            {createMutation.isPending ? (
              <>
                <ButtonSpinner />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Stock to Inventory</span>
                <span className="sm:hidden">Add to Inventory</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DirectStockForm;
