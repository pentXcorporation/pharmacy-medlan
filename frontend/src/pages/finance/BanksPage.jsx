/**
 * Banks Page
 * Manages bank accounts
 */

import { useState, useMemo } from "react";
import { Plus, Download, Building2 } from "lucide-react";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

const BanksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "bankName",
        header: "Bank Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.getValue("bankName")}</span>
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
        accessorKey: "accountType",
        header: "Type",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => row.getValue("accountType") || "CURRENT",
      },
      {
        accessorKey: "branchName",
        header: "Branch",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => row.getValue("branchName") || "-",
      },
      {
        accessorKey: "currentBalance",
        header: "Balance",
        cell: ({ row }) => (
          <span className="font-semibold text-lg">
            {formatCurrency(row.getValue("currentBalance") || 0)}
          </span>
        ),
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
    ],
    []
  );

  const stats = {
    totalBanks: 0,
    totalBalance: 0,
    activeAccounts: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bank Accounts"
        description="Manage bank accounts and balances"
      >
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bank Account
          </Button>
          <Button variant="outline">
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
        data={mockData.content}
        isLoading={false}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: mockData.total,
          pageCount: mockData.pageCount,
        }}
        onPaginationChange={setPagination}
        emptyMessage="No bank accounts found."
      />
    </div>
  );
};

export default BanksPage;
