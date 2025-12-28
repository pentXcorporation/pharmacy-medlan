/**
 * Supplier Form Component
 * Form for creating and editing suppliers
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonSpinner } from "@/components/common";

// Validation schema
const supplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required").max(100),
  contactPerson: z.string().max(100).optional().nullable(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15)
    .optional()
    .or(z.literal("")),
  mobile: z.string().max(15).optional().nullable(),
  fax: z.string().max(20).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(50).optional().nullable(),
  country: z.string().max(50).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  taxId: z.string().max(50).optional().nullable(),
  bankName: z.string().max(100).optional().nullable(),
  bankAccountNo: z.string().max(50).optional().nullable(),
  bankBranch: z.string().max(100).optional().nullable(),
  paymentTerms: z.coerce.number().min(0).optional().nullable(),
  creditLimit: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

/**
 * SupplierForm component
 */
const SupplierForm = ({
  supplier,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(supplier);

  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplierName: "",
      contactPerson: "",
      email: "",
      phone: "",
      mobile: "",
      fax: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      taxId: "",
      bankName: "",
      bankAccountNo: "",
      bankBranch: "",
      paymentTerms: 30,
      creditLimit: 0,
      notes: "",
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (supplier) {
      form.reset({
        supplierName: supplier.supplierName || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        mobile: supplier.mobile || "",
        fax: supplier.fax || "",
        address: supplier.address || "",
        city: supplier.city || "",
        country: supplier.country || "",
        postalCode: supplier.postalCode || "",
        taxId: supplier.taxId || "",
        bankName: supplier.bankName || "",
        bankAccountNo: supplier.bankAccountNo || "",
        bankBranch: supplier.bankBranch || "",
        paymentTerms: supplier.paymentTerms || 30,
        creditLimit: supplier.creditLimit || 0,
        notes: supplier.notes || "",
        isActive: supplier.isActive ?? true,
      });
    }
  }, [supplier, form]);

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Supplier Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Pharmaceuticals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Smith"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID / VAT Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tax registration number"
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

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="supplier@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+94 11 234 5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+94 77 123 4567"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fax</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+94 11 234 5679"
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

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Industrial Zone"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Colombo"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sri Lanka"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00100"
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

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Commercial Bank"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankBranch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Main Branch"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAccountNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567890"
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

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Credit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of days for payment after invoice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Limit</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum credit allowed from this supplier
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this supplier..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Inactive suppliers won't appear in purchase orders
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
            {isEditing ? "Update Supplier" : "Create Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;
