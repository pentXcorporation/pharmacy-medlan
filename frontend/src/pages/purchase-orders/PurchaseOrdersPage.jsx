/**
 * Purchase Orders Page
 * Lists all purchase orders with filtering and actions
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, PageHeader, ConfirmDialog } from "@/components/common";
import {
  usePurchaseOrders,
  useDeletePurchaseOrder,
  useSubmitPurchaseOrder,
  useApprovePurchaseOrder,
  useRejectPurchaseOrder,
  getPurchaseOrderColumns,
} from "@/features/purchase-orders";

const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, po: null });
  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    po: null,
    reason: "",
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
  const { data: posData, isLoading } = usePurchaseOrders(params);
  const deleteMutation = useDeletePurchaseOrder();
  const submitMutation = useSubmitPurchaseOrder();
  const approveMutation = useApprovePurchaseOrder();
  const rejectMutation = useRejectPurchaseOrder();

  const purchaseOrders = posData?.content || posData || [];

  // Handlers
  const handleView = useCallback(
    (po) => {
      navigate(ROUTES.PURCHASE_ORDERS.VIEW(po.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (po) => {
      navigate(ROUTES.PURCHASE_ORDERS.EDIT(po.id));
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((po) => {
    setDeleteDialog({ open: true, po });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.po) {
      deleteMutation.mutate(deleteDialog.po.id, {
        onSuccess: () => setDeleteDialog({ open: false, po: null }),
      });
    }
  }, [deleteDialog.po, deleteMutation]);

  const handleSubmit = useCallback(
    (po) => {
      submitMutation.mutate(po.id);
    },
    [submitMutation]
  );

  const handleApprove = useCallback(
    (po) => {
      approveMutation.mutate(po.id);
    },
    [approveMutation]
  );

  const handleRejectClick = useCallback((po) => {
    setRejectDialog({ open: true, po, reason: "" });
  }, []);

  const handleRejectConfirm = useCallback(() => {
    if (rejectDialog.po) {
      rejectMutation.mutate(
        { id: rejectDialog.po.id, reason: rejectDialog.reason },
        {
          onSuccess: () =>
            setRejectDialog({ open: false, po: null, reason: "" }),
        }
      );
    }
  }, [rejectDialog, rejectMutation]);

  const handleReceive = useCallback(
    (po) => {
      // Navigate to GRN creation with PO context
      navigate(`${ROUTES.GRN.CREATE}?poId=${po.id}`);
    },
    [navigate]
  );

  // Columns
  const columns = useMemo(
    () =>
      getPurchaseOrderColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        onSubmit: handleSubmit,
        onApprove: handleApprove,
        onReject: handleRejectClick,
        onReceive: handleReceive,
      }),
    [
      handleView,
      handleEdit,
      handleDeleteClick,
      handleSubmit,
      handleApprove,
      handleRejectClick,
      handleReceive,
    ]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Manage purchase orders with suppliers"
        icon={ShoppingCart}
        actions={
          <Button onClick={() => navigate(ROUTES.PURCHASE_ORDERS.NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by PO number, supplier..."
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
            <SelectItem value="PENDING">Pending Approval</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="ORDERED">Ordered</SelectItem>
            <SelectItem value="PARTIALLY_RECEIVED">
              Partially Received
            </SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={purchaseOrders}
        isLoading={isLoading}
        searchable={false}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, po: null })}
        title="Delete Purchase Order"
        description={`Are you sure you want to delete PO "${deleteDialog.po?.poNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog({ open, po: null, reason: "" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Purchase Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting PO "
              {rejectDialog.po?.poNumber}".
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectDialog.reason}
            onChange={(e) =>
              setRejectDialog({ ...rejectDialog, reason: e.target.value })
            }
            rows={3}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog({ open: false, po: null, reason: "" })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectDialog.reason || rejectMutation.isPending}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrdersPage;
