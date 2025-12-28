/**
 * Product Form Component
 * Reusable form for creating and editing products
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { productSchema } from "@/utils/validators";
import { useActiveCategories } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DOSAGE_FORMS,
  DOSAGE_FORM_LABELS,
  DRUG_SCHEDULES,
  DRUG_SCHEDULE_LABELS,
} from "@/constants";

/**
 * ProductForm component
 */
const ProductForm = ({ product, onSubmit, isSubmitting = false, onCancel }) => {
  const { data: categories = [], isLoading: loadingCategories } =
    useActiveCategories();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      genericName: "",
      categoryId: "",
      dosageForm: "",
      strength: "",
      drugSchedule: "",
      manufacturer: "",
      barcode: "",
      description: "",
      costPrice: "",
      sellingPrice: "",
      mrp: "",
      gstRate: "",
      reorderLevel: "",
      minimumStock: "",
      maximumStock: "",
      isPrescriptionRequired: false,
      isNarcotic: false,
      isRefrigerated: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (product) {
      form.reset({
        productName: product.productName || "",
        genericName: product.genericName || "",
        categoryId: product.category?.id?.toString() || "",
        dosageForm: product.dosageForm || "",
        strength: product.strength || "",
        drugSchedule: product.drugSchedule || "",
        manufacturer: product.manufacturer || "",
        barcode: product.barcode || "",
        description: product.description || "",
        costPrice: product.costPrice?.toString() || "",
        sellingPrice: product.sellingPrice?.toString() || "",
        mrp: product.mrp?.toString() || "",
        gstRate: product.gstRate?.toString() || "",
        reorderLevel: product.reorderLevel?.toString() || "",
        minimumStock: product.minimumStock?.toString() || "",
        maximumStock: product.maximumStock?.toString() || "",
        isPrescriptionRequired: product.isPrescriptionRequired || false,
        isNarcotic: product.isNarcotic || false,
        isRefrigerated: product.isRefrigerated || false,
      });
    }
  }, [product, form]);

  const handleSubmit = (data) => {
    // Convert string values to numbers
    const formattedData = {
      ...data,
      categoryId: data.categoryId ? parseInt(data.categoryId) : null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
      sellingPrice: data.sellingPrice ? parseFloat(data.sellingPrice) : null,
      mrp: data.mrp ? parseFloat(data.mrp) : null,
      gstRate: data.gstRate ? parseFloat(data.gstRate) : null,
      reorderLevel: data.reorderLevel ? parseInt(data.reorderLevel) : null,
      minimumStock: data.minimumStock ? parseInt(data.minimumStock) : null,
      maximumStock: data.maximumStock ? parseInt(data.maximumStock) : null,
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genericName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter generic name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.categoryName}
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
              name="dosageForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage Form</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dosage form" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DOSAGE_FORMS).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {DOSAGE_FORM_LABELS[value]}
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
              name="strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strength</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 500mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="drugSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug Schedule</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DRUG_SCHEDULES).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {DRUG_SCHEDULE_LABELS[value]}
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
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter barcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MRP</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gstRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="reorderLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Level</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Alert when stock falls below
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximumStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            <FormField
              control={form.control}
              name="isPrescriptionRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Prescription Required</FormLabel>
                    <FormDescription>
                      Requires valid prescription to sell
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isNarcotic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Narcotic Drug</FormLabel>
                    <FormDescription>
                      Subject to special regulations
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRefrigerated"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Requires Refrigeration</FormLabel>
                    <FormDescription>
                      Must be stored in cold chain
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
