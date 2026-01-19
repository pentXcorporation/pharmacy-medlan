/**
 * Banks Page
 * Manages bank accounts
 */

import { useState, useMemo } from "react";
import { Plus, Download, Building2, Edit, Trash2 } from "lucide-react";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bankService } from "@/services";
import { toast } from "sonner";
import BankFormDialog from "./BankFormDialog";
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

const BanksPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);

  // Fetch banks with pagination
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["banks", pagination.pageIndex, pagination.pageSize, searchQuery],
    queryFn: async () => {
      const response = await bankService.getAll({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: "bankName,asc",
      });
      return response.data.data;
    },
  });

  // Fetch total balance
  const { data: totalBalance } = useQuery({
    queryKey: ["banks-total-balance"],
    queryFn: async () => {
      const response = await bankService.getTotalBalance();
      return response.data.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => bankService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["banks-total-balance"]);
      toast.success("Bank account created successfully");
      setDialogOpen(false);
      setSelectedBank(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create bank account");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => bankService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["banks-total-balance"]);
      toast.success("Bank account updated successfully");
      setDialogOpen(false);
      setSelectedBank(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update bank account");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => bankService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["banks-total-balance"]);
      toast.success("Bank account deactivated successfully");
      setDeleteDialogOpen(false);
      setBankToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to deactivate bank account");
    },
  });

  const handleSubmit = (formData) => {
    if (selectedBank) {
      updateMutation.mutate({ id: selectedBank.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (bank) => {
    setSelectedBank(bank);
    setDialogOpen(true);
  };

  const handleDelete = (bank) => {
    setBankToDelete(bank);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bankToDelete) {
      deleteMutation.mutate(bankToDelete.id);
    }
  };

  const handleExport = () => {
    if (!data?.content || data.content.length === 0) return;

    const csv = [
      ["Bank Name", "Account Number", "IFSC Code", "Branch", "Account Type", "Balance", "Status"],
      ...data.content.map((bank) => [
        bank.bankName,
        bank.accountNumber,
        bank.ifscCode || "",
        bank.branchName || "",
        bank.accountType,
        bank.currentBalance,
        bank.isActive ? "Active" : "Inactive",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `banks-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "bankName",
        header: "Bank Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">{row.getValue("bankName")}</span>
              {row.original.branchName && (
                <div className="text-xs text-muted-foreground">
                  {row.original.branchName}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "accountNumber",
        header: "Account Number",
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue("accountNumber")}
          </span>
        ),
      },
      {
        accessorKey: "accountHolderName",
        header: "Account Holder",
        meta: { className: "hidden lg:table-cell" },
      },
      {
        accessorKey: "accountType",
        header: "Type",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue("accountType")}</Badge>
        ),
      },
      {
        accessorKey: "currentBalance",
        header: "Balance",
        cell: ({ row }) => {
          const balance = row.getValue("currentBalance") || 0;
          return (
            <span
              className={`font-semibold ${
                balance < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(balance)}
            </span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.getValue("isActive");
          return (
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const stats = {
    totalBanks: data?.totalElements || 0,
    totalBalance: totalBalance || 0,
    activeAccounts: data?.content?.filter((b) => b.isActive)?.length || 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bank Accounts"
        description="Manage bank accounts and balances"
      >
        <div className="flex gap-2">
          <Button onClick={() => {
            setSelectedBank(null);
            setDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bank Account
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={!data?.content?.length}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBanks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAccounts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search bank accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.content || []}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: data?.totalElements || 0,
          pageCount: data?.totalPages || 0,
        }}
        onPaginationChange={setPagination}
        emptyMessage="No bank accounts found."
      />

      {/* Bank Form Dialog */}
      <BankFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bank={selectedBank}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Bank Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {bankToDelete?.bankName}? This action will mark the account as inactive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BanksPage;
