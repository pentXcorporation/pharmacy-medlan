/**
 * Employee Form Page
 * Create and edit employee records
 */

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common";
import { useUser, useCreateUser, useUpdateUser } from "@/features/users";
import { useActiveBranches } from "@/features/branches";
import { ROUTES } from "@/config";
import { ROLES } from "@/constants";
import { toast } from "sonner";

// Validation schema for creating employee
const createEmployeeSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  branchId: z.string().optional(),
  employeeCode: z.string().optional(),
});

// Validation schema for editing employee
const editEmployeeSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  branchId: z.string().optional(),
  employeeCode: z.string().optional(),
});

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Queries
  const { data: employee, isLoading: loadingEmployee } = useUser(id, {
    enabled: isEditing,
  });
  const { data: branchesData } = useActiveBranches();
  const branches = branchesData || [];

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  // Form
  const form = useForm({
    resolver: zodResolver(
      isEditing ? editEmployeeSchema : createEmployeeSchema
    ),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "",
      branchId: "",
      employeeCode: "",
    },
  });

  // Load employee data
  useEffect(() => {
    if (employee) {
      form.reset({
        username: employee.username || "",
        fullName: employee.fullName || "",
        email: employee.email || "",
        phoneNumber: employee.phoneNumber || "",
        role: employee.role || "",
        branchId: employee.branchId ? String(employee.branchId) : "",
        employeeCode: employee.employeeCode || "",
      });
    }
  }, [employee, form]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        // For update - only send fields that UpdateUserRequest accepts
        const updatePayload = {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber || null,
          role: data.role,
        };
        await updateMutation.mutateAsync({ id, data: updatePayload });
        toast.success("Employee updated successfully");
      } else {
        // For create - send all fields including username, password, etc.
        const createPayload = {
          username: data.username,
          password: data.password,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber || null,
          role: data.role,
          branchId:
            data.branchId && data.branchId !== "all"
              ? parseInt(data.branchId)
              : null,
          employeeCode: data.employeeCode || null,
        };
        await createMutation.mutateAsync(createPayload);
        toast.success("Employee created successfully");
      }
      navigate(ROUTES.EMPLOYEES.LIST);
    } catch (error) {
      toast.error(error.message || "Failed to save employee");
    }
  };

  if (isEditing && loadingEmployee) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={isEditing ? "Edit Employee" : "Add New Employee"}
        description={
          isEditing
            ? "Update employee information"
            : "Create a new employee record"
        }
      >
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.EMPLOYEES.LIST)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Fill in the details below to {isEditing ? "update" : "create"} an
            employee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          {...field}
                          disabled={isEditing}
                        />
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
                        <Input
                          placeholder="EMP001"
                          {...field}
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              {!isEditing && (
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
              )}

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 XX XXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Work Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ROLES.PHARMACIST}>
                            Pharmacist
                          </SelectItem>
                          <SelectItem value={ROLES.CASHIER}>Cashier</SelectItem>
                          <SelectItem value={ROLES.INVENTORY_MANAGER}>
                            Inventory Manager
                          </SelectItem>
                          <SelectItem value={ROLES.BRANCH_MANAGER}>
                            Branch Manager
                          </SelectItem>
                          <SelectItem value={ROLES.ACCOUNTANT}>
                            Accountant
                          </SelectItem>
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
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          {branches.map((branch) => (
                            <SelectItem
                              key={branch.id}
                              value={String(branch.id)}
                            >
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {isEditing
                          ? "Branch cannot be changed after creation"
                          : "Leave empty for multi-branch access"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.EMPLOYEES.LIST)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isEditing
                    ? "Update Employee"
                    : "Create Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeFormPage;
