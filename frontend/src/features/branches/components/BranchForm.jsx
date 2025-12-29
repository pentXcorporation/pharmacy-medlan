/**
 * Branch Form Component
 * Form for creating and editing branches
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
const branchSchema = z.object({
  branchName: z.string().min(1, "Branch name is required").max(100),
  branchCode: z.string().min(1, "Branch code is required").max(20),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15)
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(50).optional().nullable(),
  district: z.string().max(50).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  openingTime: z.string().optional().nullable(),
  closingTime: z.string().optional().nullable(),
  isMainBranch: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

/**
 * BranchForm component
 */
const BranchForm = ({ branch, onSubmit, onCancel, isSubmitting = false }) => {
  const isEditing = Boolean(branch);

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branchName: "",
      branchCode: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      openingTime: "08:00",
      closingTime: "20:00",
      isMainBranch: false,
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (branch) {
      form.reset({
        branchName: branch.branchName || "",
        branchCode: branch.branchCode || "",
        phone: branch.phone || "",
        email: branch.email || "",
        address: branch.address || "",
        city: branch.city || "",
        district: branch.district || "",
        postalCode: branch.postalCode || "",
        openingTime: branch.openingTime || "08:00",
        closingTime: branch.closingTime || "20:00",
        isMainBranch: branch.isMainBranch ?? false,
        isActive: branch.isActive ?? true,
      });
    }
  }, [branch, form]);

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Branch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="BR001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for this branch
                  </FormDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="branch@pharmacy.com"
                      {...field}
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
            <CardTitle>Location</CardTitle>
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
                      placeholder="123 Main Street"
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
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

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="openingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="isMainBranch"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Main Branch</FormLabel>
                    <FormDescription>
                      Set as the main/headquarters branch
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Inactive branches cannot process transactions
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
            {isEditing ? "Update Branch" : "Create Branch"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
