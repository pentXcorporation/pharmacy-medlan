/**
 * Credit Accounts Page
 * Displays customers with outstanding credit balances
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Download, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { ROUTES } from "@/config";
import { useCustomers } from "@/features/customers";
import { getCreditAccountColumns } from "@/features/customers/components/CreditAccountColumns";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

/**
 * CreditAccountsPage component
 */
const CreditAccountsPage = () => {
  const navigate = useNavigate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [creditFilter, setcreditFilter] = useState("all");

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sorting state
  const [sorting, setSorting] = useState([
    { id: "currentBalance", desc: true },
  ]);

  // Build query params - only get customers with credit limits
  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort:
        sorting.length > 0
          ? `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`
          : "currentBalance,desc",
      ...(searchQuery && { search: searchQuery }),
      isActive: true, // Only active customers
    }),
    [pagination, sorting, searchQuery]
  );

  // Fetch customers
  const { data, isLoading, isFetching } = useCustomers(queryParams);

  // Filter customers with credit limits and apply credit filter
  const filteredData = useMemo(() => {
    if (!data?.content) return [];

    let filtered = data.content.filter((customer) => {
      const creditLimit = customer.creditLimit || 0;
      const balance = customer.currentBalance || 0;

      // Only show customers with credit limits set
      if (creditLimit <= 0) return false;

      // Apply credit filter
      if (creditFilter === "outstanding") {
        return balance > 0;
      } else if (creditFilter === "overLimit") {
        return balance > creditLimit;
      } else if (creditFilter === "nearLimit") {
        return balance >= creditLimit * 0.75 && balance < creditLimit;
      }

      return true; // "all" filter
    });

    return filtered;
  }, [data?.content, creditFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredData.length)
      return {
        totalCustomers: 0,
        totalOutstanding: 0,
        totalCreditLimit: 0,
        overLimitCount: 0,
      };

    const totalOutstanding = filteredData.reduce(
      (sum, customer) => sum + (customer.currentBalance || 0),
      0
    );
    const totalCreditLimit = filteredData.reduce(
      (sum, customer) => sum + (customer.creditLimit || 0),
      0
    );
    const overLimitCount = filteredData.filter(
      (customer) => customer.currentBalance > customer.creditLimit
    ).length;

    return {
      totalCustomers: filteredData.length,
      totalOutstanding,
      totalCreditLimit,
      overLimitCount,
    };
  }, [filteredData]);

  // Handlers
  const handleView = useCallback(
    (customer) => {
      navigate(ROUTES.CUSTOMERS.VIEW(customer.id));
    },
    [navigate]
  );

  const handleManageCredit = useCallback(
    (customer) => {
      navigate(ROUTES.CUSTOMERS.EDIT(customer.id));
    },
    [navigate]
  );

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log("Export credit accounts");
  }, []);

  // Get columns
  const columns = useMemo(
    () =>
      getCreditAccountColumns({
        onView: handleView,
        onManageCredit: handleManageCredit,
      }),
    [handleView, handleManageCredit]
  );

  // Prepare pagination data for server-side mode
  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const paginatedItems = filteredData.slice(
      start,
      start + pagination.pageSize
    );

    return {
      content: paginatedItems,
      total: filteredData.length,
      pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    };
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Credit Accounts"
        description="Manage customer credit accounts and outstanding balances"
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              With credit accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground">Total receivables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Credit Limit
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalCreditLimit)}
            </div>
            <p className="text-xs text-muted-foreground">Available credit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Limit</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.overLimitCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Customers exceeding limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, code, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={creditFilter} onValueChange={setcreditFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by credit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="outstanding">With Balance</SelectItem>
              <SelectItem value="overLimit">Over Limit</SelectItem>
              <SelectItem value="nearLimit">Near Limit (75%+)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginationData.content}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: paginationData.total,
          pageCount: paginationData.pageCount,
        }}
        onPaginationChange={(updater) => {
          setPagination((old) =>
            typeof updater === "function" ? updater(old) : updater
          );
        }}
        sorting={sorting}
        onSortingChange={setSorting}
        manualPagination={false}
        manualSorting={false}
        showPagination={true}
        emptyMessage="No credit accounts found."
      />
    </div>
  );
};

export default CreditAccountsPage;
