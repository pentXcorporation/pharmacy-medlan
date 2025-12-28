/**
 * Product View Page
 * Displays detailed product information
 */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, XCircle, Package } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useProduct,
  useDeleteProduct,
  useDiscontinueProduct,
} from "@/features/products";
import { PageHeader, PageLoader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/components/common/ConfirmDialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DOSAGE_FORM_LABELS, DRUG_SCHEDULE_LABELS } from "@/constants";

/**
 * ProductViewPage component
 */
const ProductViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const confirm = useConfirm();

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();
  const discontinueProduct = useDiscontinueProduct();

  const handleEdit = () => {
    navigate(ROUTES.PRODUCTS.EDIT(id));
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Product",
      description: `Are you sure you want to delete "${product?.productName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (confirmed) {
      deleteProduct.mutate(id, {
        onSuccess: () => navigate(ROUTES.PRODUCTS.LIST),
      });
    }
  };

  const handleDiscontinue = async () => {
    const confirmed = await confirm({
      title: "Discontinue Product",
      description: `Are you sure you want to discontinue "${product?.productName}"?`,
      confirmText: "Discontinue",
      cancelText: "Cancel",
      variant: "warning",
    });

    if (confirmed) {
      discontinueProduct.mutate(id);
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading product..." />;
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The product you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate(ROUTES.PRODUCTS.LIST)}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.productName}
        description={product.genericName || "No generic name"}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {!product.isDiscontinued && (
              <Button variant="outline" onClick={handleDiscontinue}>
                <XCircle className="mr-2 h-4 w-4" />
                Discontinue
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product Code</span>
              <span className="font-mono">{product.productCode}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <Badge variant="outline">
                {product.category?.categoryName || "-"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dosage Form</span>
              <span>
                {DOSAGE_FORM_LABELS[product.dosageForm] ||
                  product.dosageForm ||
                  "-"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Strength</span>
              <span>{product.strength || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Drug Schedule</span>
              {product.drugSchedule ? (
                <Badge
                  variant={
                    product.drugSchedule === "X" ? "destructive" : "secondary"
                  }
                >
                  {DRUG_SCHEDULE_LABELS[product.drugSchedule]}
                </Badge>
              ) : (
                <span>-</span>
              )}
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Manufacturer</span>
              <span>{product.manufacturer || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Barcode</span>
              <span className="font-mono">{product.barcode || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge
                status={
                  product.isDiscontinued
                    ? "discontinued"
                    : product.isActive
                    ? "active"
                    : "inactive"
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost Price</span>
              <span className="font-medium">
                {formatCurrency(product.costPrice)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selling Price</span>
              <span className="font-medium text-lg">
                {formatCurrency(product.sellingPrice)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">MRP</span>
              <span>{formatCurrency(product.mrp)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST Rate</span>
              <span>{product.gstRate ? `${product.gstRate}%` : "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profit Margin</span>
              <span className="text-green-600">
                {product.costPrice && product.sellingPrice
                  ? `${(
                      ((product.sellingPrice - product.costPrice) /
                        product.costPrice) *
                      100
                    ).toFixed(1)}%`
                  : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reorder Level</span>
              <span>{product.reorderLevel || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Stock</span>
              <span>{product.minimumStock || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maximum Stock</span>
              <span>{product.maximumStock || "-"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Prescription Required
              </span>
              <Badge
                variant={
                  product.isPrescriptionRequired ? "destructive" : "secondary"
                }
              >
                {product.isPrescriptionRequired ? "Yes" : "No"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Narcotic Drug</span>
              <Badge variant={product.isNarcotic ? "destructive" : "secondary"}>
                {product.isNarcotic ? "Yes" : "No"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Requires Refrigeration
              </span>
              <Badge variant={product.isRefrigerated ? "warning" : "secondary"}>
                {product.isRefrigerated ? "Yes" : "No"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(product.createdAt)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{formatDate(product.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductViewPage;
