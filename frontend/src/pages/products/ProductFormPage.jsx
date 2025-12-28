/**
 * Product Form Page
 * Create or edit a product
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  ProductForm,
} from "@/features/products";
import { PageHeader, PageLoader } from "@/components/common";
import { Button } from "@/components/ui/button";

/**
 * ProductFormPage component
 */
const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch product if editing
  const { data: product, isLoading } = useProduct(id);

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = (data) => {
    if (isEditing) {
      updateProduct.mutate(
        { id, data },
        {
          onSuccess: () => navigate(ROUTES.PRODUCTS.LIST),
        }
      );
    } else {
      createProduct.mutate(data, {
        onSuccess: () => navigate(ROUTES.PRODUCTS.LIST),
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isEditing && isLoading) {
    return <PageLoader message="Loading product..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Product" : "Add New Product"}
        description={
          isEditing
            ? `Editing: ${product?.productName}`
            : "Create a new product in your catalog"
        }
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="max-w-4xl">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createProduct.isPending || updateProduct.isPending}
        />
      </div>
    </div>
  );
};

export default ProductFormPage;
