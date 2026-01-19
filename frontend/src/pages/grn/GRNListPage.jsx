/**
 * GRN List Page
 * Lists all Goods Received Notes with filtering and actions
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, PageHeader, ConfirmDialog } from "@/components/common";
import {
  useGRNs,
  useApproveGRN,
  getGRNColumns,
} from "@/features/grn";
import { toast } from "sonner";

const GRNListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionDialog, setActionDialog] = useState({
    open: false,
    grn: null,
    action: "",
  });

  // Query params
  const params = useMemo(
    () => ({
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    }),
    [search, statusFilter]
  );

  // Queries and mutations
  const { data: grnsData, isLoading } = useGRNs(params);
  const approveMutation = useApproveGRN();

  const grns = grnsData?.content || grnsData || [];

  // Handlers
  const handleView = useCallback(
    (grn) => {
      navigate(ROUTES.GRN.VIEW(grn.id));
    },
    [navigate]
  );

  const handleApprove = useCallback((grn) => {
    // Check if GRN has complete data for all items
    const items = grn.items || [];
    const hasCompleteData = items.every(item => 
      item.batchNumber && 
      item.manufacturingDate && 
      item.expiryDate && 
      item.sellingPrice && 
      item.mrp
    );

    if (!hasCompleteData) {
      toast.error("This GRN has missing required fields. Redirecting to edit page...", {
        description: "Please fill in batch number, dates, selling price, and MRP for all items."
      });
      // Redirect to edit page after a short delay
      setTimeout(() => {
        navigate(`${ROUTES.GRN.EDIT}/${grn.id}`);
      }, 1500);
      return;
    }

    setActionDialog({ open: true, grn, action: "approve" });
  }, [navigate]);

  const handleCreateReturn = useCallback(
    (grn) => {
      navigate(`${ROUTES.RGRN.CREATE}?grnId=${grn.id}`);
    },
    [navigate]
  );

  const handleActionConfirm = useCallback(() => {
    if (!actionDialog.grn) return;

    approveMutation.mutate(actionDialog.grn.id, {
      onSuccess: () => setActionDialog({ open: false, grn: null, action: "" }),
    });
  }, [actionDialog, approveMutation]);

  // Columns
  const columns = useMemo(
    () =>
      getGRNColumns({
        onView: handleView,
        onComplete: handleApprove, // Note: onComplete callback still used but calls handleApprove
        onCreateReturn: handleCreateReturn,
      }),
    [handleView, handleApprove, handleCreateReturn]
  );

  const getDialogTitle = () => {
    if (actionDialog.action === "approve") return "Approve GRN";
    return "";
  };

  const getDialogDescription = () => {
    if (actionDialog.action === "approve") {
      return `This will approve GRN "${actionDialog.grn?.grnNumber}", create inventory batches, and update stock levels. This action cannot be undone.`;
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Received Notes"
        description="Manage goods received from suppliers"
        icon={Package}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.GRN.DIRECT)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Direct Stock
            </Button>
            <Button onClick={() => navigate(ROUTES.GRN.CREATE)}>
              <Plus className="mr-2 h-4 w-4" />
              New GRN
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by GRN number, PO, supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-[300px]"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PENDING">Pending Verification</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={grns}
        isLoading={isLoading}
        searchable={false}
      />

      {/* Action Confirmation */}
      <ConfirmDialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          setActionDialog({ open, grn: null, action: "" })
        }
        title={getDialogTitle()}
        description={getDialogDescription()}
        confirmText={
          actionDialog.action === "approve"
            ? "Approve & Update Inventory"
            : "Approve"
        }
        cancelText="Cancel"
        variant={actionDialog.action === "approve" ? "default" : "default"}
        onConfirm={handleActionConfirm}
        isLoading={approveMutation.isPending}
      />
    </div>
  );
};

export default GRNListPage;
