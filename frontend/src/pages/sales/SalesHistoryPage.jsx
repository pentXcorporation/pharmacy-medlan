/**
 * Sales History Page
 * View and manage past sales
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Undo2, Ban, FileText, Download } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, DataTable } from "@/components/common";
import { useSales, useVoidSale } from "@/features/sales";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { ROUTES } from "@/config";

// Status badge variants
const statusConfig = {
  COMPLETED: { label: "Completed", variant: "success" },
  VOIDED: { label: "Voided", variant: "destructive" },
  PARTIALLY_RETURNED: { label: "Partially Returned", variant: "warning" },
  RETURNED: { label: "Returned", variant: "secondary" },
};

const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 0,
    size: 20,
  });
  const [voidDialog, setVoidDialog] = useState({ open: false, sale: null });
  const [voidReason, setVoidReason] = useState("");

  // Query
  const { data, isLoading } = useSales({
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
  });
  const voidMutation = useVoidSale();

  const sales = data?.content || data || [];
  const totalPages = data?.totalPages || 1;

  // Handle void
  const handleVoid = () => {
    if (voidDialog.sale && voidReason.trim()) {
      voidMutation.mutate(
        { id: voidDialog.sale.id, reason: voidReason },
        {
          onSuccess: () => {
            setVoidDialog({ open: false, sale: null });
            setVoidReason("");
          },
        }
      );
    }
  };

  // Columns
  const columns = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <span className="font-medium text-xs sm:text-sm">
          {row.getValue("invoiceNumber")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      meta: { className: "hidden md:table-cell" },
      cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      meta: { className: "hidden sm:table-cell" },
      cell: ({ row }) => row.getValue("customerName") || "Walk-in",
    },
    {
      accessorKey: "itemCount",
      header: "Items",
      meta: { className: "hidden lg:table-cell" },
      cell: ({ row }) =>
        row.original.items?.length || row.getValue("itemCount") || 0,
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      meta: { className: "hidden sm:table-cell" },
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("paymentMethod")}</Badge>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-bold text-xs sm:text-sm">
          {formatCurrency(row.getValue("totalAmount"))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") || "COMPLETED";
        const config = statusConfig[status] || statusConfig.COMPLETED;
        return (
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const sale = row.original;
        const isVoided = sale.status === "VOIDED";

        return (
          <div className="flex gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => navigate(`${ROUTES.SALES.ROOT}/${sale.id}`)}
              title="View Details"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            {!isVoided && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:inline-flex"
                  onClick={() =>
                    navigate(`${ROUTES.SALE_RETURNS.CREATE}?saleId=${sale.id}`)
                  }
                  title="Process Return"
                >
                  <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:inline-flex"
                  onClick={() => setVoidDialog({ open: true, sale })}
                  title="Void Sale"
                >
                  <Ban className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 hidden md:inline-flex"
              title="Download Invoice"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Sales History"
        description="View and manage all sales transactions"
      >
        <Button
          onClick={() => navigate(ROUTES.POS.ROOT)}
          size="sm"
          className="w-full sm:w-auto"
        >
          <FileText className="h-4 w-4 mr-2" />
          New Sale
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Input
          placeholder="Search by invoice..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 0 })
          }
          className="w-full sm:w-64 md:w-80"
        />
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
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="VOIDED">Voided</SelectItem>
            <SelectItem value="PARTIALLY_RETURNED">
              Partially Returned
            </SelectItem>
            <SelectItem value="RETURNED">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sales}
        isLoading={isLoading}
        pagination={{
          pageIndex: filters.page,
          pageSize: filters.size,
          pageCount: totalPages,
          onPageChange: (page) => setFilters({ ...filters, page }),
        }}
      />

      {/* Void Dialog */}
      <Dialog
        open={voidDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setVoidDialog({ open: false, sale: null });
            setVoidReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Void Sale</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The sale will be marked as voided
              and inventory will be restored.
            </DialogDescription>
          </DialogHeader>
          {voidDialog.sale && (
            <div className="py-4">
              <div className="rounded-lg border p-4 mb-4">
                <p className="font-medium">{voidDialog.sale.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(voidDialog.sale.createdAt)}
                </p>
                <p className="font-bold mt-2">
                  {formatCurrency(voidDialog.sale.totalAmount)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Reason for Voiding *</Label>
                <Textarea
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="Enter the reason for voiding this sale..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVoidDialog({ open: false, sale: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleVoid}
              disabled={!voidReason.trim() || voidMutation.isPending}
            >
              Void Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesHistoryPage;
