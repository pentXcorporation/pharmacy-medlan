/**
 * Supplier Form Page
 * Create or edit a supplier
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useSupplier,
  useCreateSupplier,
  useUpdateSupplier,
  SupplierForm,
} from "@/features/suppliers";
import { PageHeader, PageLoader } from "@/components/common";
import { Button } from "@/components/ui/button";

/**
 * SupplierFormPage component
 */
const SupplierFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch supplier if editing
  const { data: supplier, isLoading } = useSupplier(id);

  // Mutations
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const handleSubmit = (data) => {
    if (isEditing) {
      updateSupplier.mutate(
        { id, data },
        {
          onSuccess: () => navigate(ROUTES.SUPPLIERS.LIST),
        }
      );
    } else {
      createSupplier.mutate(data, {
        onSuccess: () => navigate(ROUTES.SUPPLIERS.LIST),
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isEditing && isLoading) {
    return <PageLoader message="Loading supplier..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Supplier" : "Add New Supplier"}
        description={
          isEditing
            ? `Editing: ${supplier?.supplierName}`
            : "Create a new supplier record"
        }
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="max-w-4xl">
        <SupplierForm
          supplier={supplier}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createSupplier.isPending || updateSupplier.isPending}
        />
      </div>
    </div>
  );
};

export default SupplierFormPage;
