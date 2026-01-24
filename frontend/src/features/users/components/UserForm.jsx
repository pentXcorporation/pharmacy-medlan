/**
 * User Form Component
 * Form for creating and editing users
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonSpinner } from "@/components/common";
import { ROLES, ROLE_LABELS } from "@/constants";

// Validation schema for creating user
const createUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(100),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
    fullName: z.string().min(1, "Full name is required").max(200),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phoneNumber: z.string().optional().or(z.literal("")),
    role: z.string().min(1, "Role is required"),
    branchId: z.string().optional(),
    employeeCode: z.string().optional().or(z.literal("")),
    discountLimit: z.string().optional().or(z.literal("")),
    creditTransactionLimit: z.string().optional().or(z.literal("")),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Validation schema for editing user
const editUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  branchId: z.string().optional(),
  discountLimit: z.string().optional().or(z.literal("")),
  creditTransactionLimit: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

/**
 * UserForm component
 * @param {Object} props
 * @param {Object} props.user - User to edit (null for create)
 * @param {Array} props.branches - Available branches
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isSubmitting - Loading state
 */
const UserForm = ({
  user,
  branches = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(user);

  const form = useForm({
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "",
      branchId: "",
      employeeCode: "",
      discountLimit: "",
      creditTransactionLimit: "",
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "",
        branchId: user.branchId ? String(user.branchId) : "",
        discountLimit: user.discountLimit ? String(user.discountLimit) : "",
        creditTransactionLimit: user.creditTransactionLimit
          ? String(user.creditTransactionLimit)
          : "",
        isActive: user.isActive ?? true,
      });
    }
  }, [user, form]);

  const handleSubmit = (data) => {
    if (isEditing) {
      // For update: only send UpdateUserRequest fields
      const updatePayload = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        role: data.role,
        branchId: data.branchId ? Number(data.branchId) : null,
        isActive: data.isActive,
        discountLimit: data.discountLimit
          ? parseFloat(data.discountLimit)
          : null,
        creditTransactionLimit: data.creditTransactionLimit
          ? parseFloat(data.creditTransactionLimit)
          : null,
      };
      onSubmit(updatePayload);
    } else {
      // For create: send CreateUserRequest fields
      const { confirmPassword, ...rest } = data;
      const createPayload = {
        ...rest,
        branchId: data.branchId ? Number(data.branchId) : null,
        discountLimit: data.discountLimit
          ? parseFloat(data.discountLimit)
          : null,
        creditTransactionLimit: data.creditTransactionLimit
          ? parseFloat(data.creditTransactionLimit)
          : null,
      };
      onSubmit(createPayload);
    }
  };

  // Filter roles based on permissions (you might want to get this from context)
  const availableRoles = Object.entries(ROLE_LABELS);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+94 77 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {!isEditing && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Code</FormLabel>
                      <FormControl>
                        <Input placeholder="EMP001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No specific branch</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {isEditing 
                      ? "Update the branch this user is assigned to"
                      : "Branch the user is assigned to work at"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum discount percentage this user can apply
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creditTransactionLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Transaction Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum credit amount this user can authorize
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Password */}
        {!isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Set Password</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Inactive users cannot log in to the system
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
            {isEditing ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
