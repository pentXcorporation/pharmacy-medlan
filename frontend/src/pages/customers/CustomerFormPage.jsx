/**
 * Customer Form Page
 * Create or edit a customer
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  CustomerForm,
} from "@/features/customers";
import { PageHeader, PageLoader } from "@/components/common";
import { Button } from "@/components/ui/button";

/**
 * CustomerFormPage component
 */
const CustomerFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch customer if editing
  const { data: customer, isLoading } = useCustomer(id);

  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const handleSubmit = (data) => {
    if (isEditing) {
      updateCustomer.mutate(
        { id, data },
        {
          onSuccess: () => navigate(ROUTES.CUSTOMERS.LIST),
        }
      );
    } else {
      createCustomer.mutate(data, {
        onSuccess: () => navigate(ROUTES.CUSTOMERS.LIST),
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isEditing && isLoading) {
    return <PageLoader message="Loading customer..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Customer" : "Add New Customer"}
        description={
          isEditing
            ? `Editing: ${customer?.firstName} ${customer?.lastName}`
            : "Create a new customer record"
        }
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="max-w-4xl">
        <CustomerForm
          customer={customer}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createCustomer.isPending || updateCustomer.isPending}
        />
      </div>
    </div>
  );
};

export default CustomerFormPage;
