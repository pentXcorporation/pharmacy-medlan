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
import { ButtonSpinner } from "@/components/common";
import { useCreateGRN, useApproveGRN } from "@/features/grn";
import { useActiveSuppliers } from "@/features/suppliers";
import { useProducts } from "@/features/products";
import { useBranch } from "@/hooks";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { grnService } from "@/services";
import {
  numberValidators,
  stringValidators,
  dateValidators,
  customValidators,
  inputRestrictions,
  sanitize,
} from "@/utils/validationHelpers";

// Validation schema with enhanced validations
const grnItemSchema = z
  .object({
    productId: stringValidators.required("Product"),
    batchNumber: stringValidators.minMaxLength("Batch number", 1, 100),
    quantity: numberValidators.quantity("Quantity").max(100000, "Quantity is too large"),
    costPrice: numberValidators.price("Cost price"),
    sellingPrice: numberValidators.price("Selling price"),
    mrp: numberValidators.price("MRP"),
    manufacturingDate: dateValidators.manufacturingDate(),
    expiryDate: dateValidators.expiryDate(),
    discountAmount: z.union([
      z.string().transform(val => val === "" ? 0 : Number(val)),
      z.number()
    ]).pipe(z.number().min(0, "Discount must be positive").max(999999, "Discount is too large")).optional().default(0),
  })
  .refine(
    (data) => data.sellingPrice >= data.costPrice,
    {
      message: "Selling price must be greater than or equal to cost price",
      path: ["sellingPrice"],
    }
  )
  .refine(
    (data) => data.mrp >= data.sellingPrice,
    {
      message: "MRP must be greater than or equal to selling price",
      path: ["mrp"],
    }
  )
  .refine(
    (data) => {
      if (!data.manufacturingDate || !data.expiryDate) return true;
      return new Date(data.expiryDate) > new Date(data.manufacturingDate);
    },
    {
      message: "Expiry date must be after manufacturing date",
      path: ["expiryDate"],
    }
  )
  .refine(
    (data) => {
      const totalCost = data.quantity * data.costPrice;
      return data.discountAmount <= totalCost;
    },
    {
      message: "Discount cannot exceed total item cost",
      path: ["discountAmount"],
    }
  );

const directGRNSchema = z.object({
  supplierId: stringValidators.required("Supplier"),
  branchId: z.number().min(1, "Branch is required"),
  receivedDate: dateValidators.pastOrToday("Received date"),
  supplierInvoiceNumber: stringValidators.maxLength("Supplier invoice number", 100).optional().or(z.literal("")),
  supplierInvoiceDate: z.string().optional(),
  remarks: stringValidators.maxLength("Remarks", 1000).optional().or(z.literal("")),
  items: z.array(grnItemSchema).min(1, "At least one item is required").max(100, "Maximum 100 items allowed"),
});

const DirectStockForm = ({ onSuccess }) => {
  const { selectedBranch } = useBranch();
  const queryClient = useQueryClient();

  // Queries
  const { data: suppliers, isLoading: isLoadingSuppliers } = useActiveSuppliers();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    size: 1000,
  });
  
  // Create custom mutations without toast messages for direct stock flow
  const createMutation = useMutation({
    mutationFn: (data) => grnService.create(data),
  });
  
  const approveMutation = useMutation({
    mutationFn: (id) => grnService.approve(id),
    onSuccess: () => {
      // Invalidate all inventory queries to refresh the available stock page
      queryClient.invalidateQueries({ 
        queryKey: ["inventory"],
        exact: false
      });
      queryClient.invalidateQueries({ queryKey: ["grns"] });
    },
  });

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
          quantity: "",
          costPrice: "",
          sellingPrice: "",
          mrp: "",
          manufacturingDate: "",
          expiryDate: "",
          discountAmount: "",
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
          mrp: Number(item.mrp),
          manufacturingDate: item.manufacturingDate || null,
          expiryDate: item.expiryDate,
          discountAmount: Number(item.discountAmount) || 0,
        })),
        supplierId: parseInt(data.supplierId),
      };

      // Step 1: Create the GRN (creates in DRAFT status)
      const createResponse = await createMutation.mutateAsync(transformedData);
      
      // Extract GRN ID from response (handle ApiResponse wrapper)
      const grnId = createResponse?.data?.data?.id || createResponse?.data?.id || createResponse?.id;
      
      if (!grnId) {
        throw new Error("Failed to get GRN ID from response");
      }
      
      // Step 2: Automatically approve the GRN to update inventory
      // This creates the inventory batches and updates branch inventory
      await approveMutation.mutateAsync(grnId);
      
      toast.success("Stock added and approved successfully - inventory updated");
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
      quantity: "",
      costPrice: "",
      sellingPrice: "",
      mrp: "",
      manufacturingDate: "",
      expiryDate: "",
      discountAmount: "",
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
                <FormLabel className="text-sm font-medium">Supplier *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
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
                <FormLabel className="text-sm font-medium">Received Date *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-10"
                    {...field}
                  />
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
                <FormLabel className="text-sm font-medium">Supplier Invoice Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="INV-12345"
                    maxLength={100}
                    className="h-10"
                    {...field}
                  />
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
                <FormLabel className="text-sm font-medium">Supplier Invoice Date</FormLabel>
                <FormControl>
                  <Input type="date" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Items Table */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">Items</h3>
            <Button type="button" size="sm" onClick={addItem} className="h-9">
              <Plus className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Item</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-1 py-2 text-left text-xs font-semibold w-8">#</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[180px]">Product *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[110px]">Batch *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[70px]">Qty *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[90px]">Cost *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[90px]">Sell *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[90px]">MRP *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[110px]">MFG Date</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[110px]">Expiry *</th>
                      <th className="px-1 py-2 text-left text-xs font-semibold min-w-[80px]">Discount</th>
                      <th className="px-1 py-2 text-right text-xs font-semibold min-w-[90px]">Total</th>
                      <th className="px-1 py-2 text-center text-xs font-semibold w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {fields.map((field, index) => (
                      <tr key={field.id} className="hover:bg-muted/30">
                        <td className="px-1 py-1">
                          <span className="text-xs text-muted-foreground">{index + 1}</span>
                        </td>
                        <td className="px-1 py-1">
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
                                    <SelectTrigger className="h-8 text-xs border-0 shadow-none focus:ring-1">
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
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.batchNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="BATCH-001"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    maxLength={100}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...inputRestrictions.positiveInteger}
                                    max="100000"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                    onChange={(e) => {
                                      const value = sanitize.positiveNumber(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.costPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...inputRestrictions.positiveDecimal}
                                    max="999999999.99"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                    onChange={(e) => {
                                      const value = sanitize.positiveNumber(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.sellingPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...inputRestrictions.positiveDecimal}
                                    max="999999999.99"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                    onChange={(e) => {
                                      const value = sanitize.positiveNumber(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.mrp`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...inputRestrictions.positiveDecimal}
                                    max="999999999.99"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                    onChange={(e) => {
                                      const value = sanitize.positiveNumber(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.manufacturingDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.expiryDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="date"
                                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.discountAmount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...inputRestrictions.positiveDecimal}
                                    max="999999"
                                    className="h-8 text-xs border-0 shadow-none focus-visible:ring-1"
                                    {...field}
                                    onChange={(e) => {
                                      const value = sanitize.positiveNumber(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-1 py-1 text-right">
                          <span className="text-xs font-semibold text-primary whitespace-nowrap">
                            {formatCurrency(calculateItemTotal(items[index]))}
                          </span>
                        </td>
                        <td className="px-1 py-1 text-center">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
            <div className="flex justify-between text-sm sm:text-base font-bold border-t pt-2 mt-2">
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
              <FormLabel className="text-sm font-medium">Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or comments..."
                  className="min-h-[80px] sm:min-h-[100px] resize-none"
                  maxLength={1000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            disabled={createMutation.isPending || approveMutation.isPending}
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            {createMutation.isPending || approveMutation.isPending ? (
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