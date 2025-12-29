/**
 * Stock Transfer Form Page
 * Create or edit stock transfers
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useStockTransfer,
  useCreateStockTransfer,
  StockTransferForm,
} from "@/features/inventory";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * StockTransferFormPage component
 */
const StockTransferFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch existing transfer if editing
  const { data: transfer, isLoading: isLoadingTransfer } = useStockTransfer(id);

  // Mutation
  const createTransfer = useCreateStockTransfer();

  // Handle form submission
  const handleSubmit = (data) => {
    createTransfer.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.INVENTORY.TRANSFERS.LIST);
      },
    });
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(ROUTES.INVENTORY.TRANSFERS.LIST);
  };

  // Loading state for edit mode
  if (isEditing && isLoadingTransfer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          backButton={{
            label: "Back to Transfers",
            onClick: () => navigate(ROUTES.INVENTORY.TRANSFERS.LIST),
          }}
        />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Stock Transfer" : "New Stock Transfer"}
        description={
          isEditing
            ? "Update stock transfer details"
            : "Create a new stock transfer between branches"
        }
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.INVENTORY.TRANSFERS.LIST)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transfers
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <StockTransferForm
            initialData={transfer}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createTransfer.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StockTransferFormPage;
