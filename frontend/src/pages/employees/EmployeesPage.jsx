/**
 * Employees Page
 * Manage staff and employee information
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, DataTable } from "@/components/common";
import { useUsers, useDeleteUser } from "@/features/users";
import { useActiveBranches } from "@/features/branches";
import { ROUTES } from "@/config";

// Status badge variants
const statusConfig = {
  ACTIVE: { label: "Active", variant: "success" },
  INACTIVE: { label: "Inactive", variant: "secondary" },
  SUSPENDED: { label: "Suspended", variant: "destructive" },
};

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    branchId: "all",
    status: "all",
    page: 0,
    size: 20,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    employee: null,
  });

  // Queries
  const { data, isLoading } = useUsers({
    ...filters,
    branchId: filters.branchId === "all" ? undefined : filters.branchId,
    status: filters.status === "all" ? undefined : filters.status,
  });
  const { data: branchesData } = useActiveBranches();
  const deleteMutation = useDeleteUser();

  const employees = data?.content || data || [];
  const branches = branchesData || [];
  const totalPages = data?.totalPages || 1;

  // Handle delete
  const handleDelete = () => {
    if (deleteDialog.employee) {
      deleteMutation.mutate(deleteDialog.employee.id, {
        onSuccess: () => setDeleteDialog({ open: false, employee: null }),
      });
    }
  };

  // Columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("role")}</Badge>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => row.getValue("branchName") || "All Branches",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") || "ACTIVE";
        const config = statusConfig[status] || statusConfig.ACTIVE;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(ROUTES.EMPLOYEES.VIEW(employee.id))}
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(ROUTES.EMPLOYEES.EDIT(employee.id))}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialog({ open: true, employee })}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your staff and employee information"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.EMPLOYEES.ATTENDANCE)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Attendance
          </Button>
          <Button onClick={() => navigate(ROUTES.EMPLOYEES.NEW)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Employee List</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search employees..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 0 })
              }
              className="sm:w-80"
            />
            <Select
              value={filters.branchId}
              onValueChange={(value) =>
                setFilters({ ...filters, branchId: value, page: 0 })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value, page: 0 })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={employees}
            isLoading={isLoading}
            pagination={{
              pageIndex: filters.page,
              pageSize: filters.size,
              pageCount: totalPages,
              onPageChange: (page) => setFilters({ ...filters, page }),
            }}
          />
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                Overview of employee attendance for the current month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Attendance tracking coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog({ open: false, employee: null });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deleteDialog.employee?.firstName}{" "}
                {deleteDialog.employee?.lastName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesPage;
