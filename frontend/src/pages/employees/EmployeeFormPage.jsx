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
import { Textarea } from "@/components/ui/textarea";
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

// Validation schema
const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
  branchId: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  salary: z.string().optional(),
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
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      branchId: "",
      address: "",
      emergencyContact: "",
      salary: "",
    },
  });

  // Load employee data
  useEffect(() => {
    if (employee) {
      form.reset({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role: employee.role || "",
        branchId: employee.branchId ? String(employee.branchId) : "",
        address: employee.address || "",
        emergencyContact: employee.emergencyContact || "",
        salary: employee.salary ? String(employee.salary) : "",
      });
    }
  }, [employee, form]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        branchId: data.branchId ? parseInt(data.branchId) : null,
        salary: data.salary ? parseFloat(data.salary) : null,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id, data: payload });
        toast.success("Employee updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">All Branches</SelectItem>
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
                        Leave empty for multi-branch access
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Information */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter address"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 XX XXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary (Monthly)</FormLabel>
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
