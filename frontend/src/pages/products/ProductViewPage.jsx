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
import {
  DOSAGE_FORM_LABELS,
  DRUG_SCHEDULE_LABELS,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_BADGE_CLASS,
  PRODUCT_TYPE,
} from "@/constants";

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
              <span className="text-muted-foreground">Product Type</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  PRODUCT_TYPE_BADGE_CLASS[product.productType] ||
                  "bg-gray-100 text-gray-800 border-gray-200"
                }`}
              >
                {PRODUCT_TYPE_LABELS[product.productType] ||
                  product.productType ||
                  "-"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <Badge variant="outline">
                {product.category?.categoryName || "-"}
              </Badge>
            </div>
            {product.productType === PRODUCT_TYPE.MEDICAL && (
              <>
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
                        product.drugSchedule === "X"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {DRUG_SCHEDULE_LABELS[product.drugSchedule]}
                    </Badge>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </>
            )}
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

      {/* Type-Specific Details */}
      {product.productType === PRODUCT_TYPE.SUPPLEMENT && (
        <Card>
          <CardHeader>
            <CardTitle>Supplement Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Supplement Type", product.supplementType],
              ["Age Group", product.ageGroup],
              ["Serving Size", product.servingSize],
              ["Servings per Container", product.servingsPerContainer],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.activeIngredients && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Active Ingredients
                </p>
                <p className="text-sm">{product.activeIngredients}</p>
              </div>
            )}
            {product.dosageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Dosage Instructions
                </p>
                <p className="text-sm">{product.dosageInstructions}</p>
              </div>
            )}
            {product.warnings && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">Warnings</p>
                <p className="text-sm text-amber-700">{product.warnings}</p>
              </div>
            )}
            <div className="sm:col-span-2 flex gap-4">
              {product.isFdaApproved && (
                <Badge variant="secondary">FDA / FSSAI Approved</Badge>
              )}
              {product.isCertifiedOrganic && (
                <Badge variant="secondary">Certified Organic</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {product.productType === PRODUCT_TYPE.FOOD && (
        <Card>
          <CardHeader>
            <CardTitle>Food &amp; Beverage Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Food Category", product.foodCategory],
              ["Allergen Info", product.allergenInfo],
              [
                "Shelf Life",
                product.shelfLifeDays ? `${product.shelfLifeDays} days` : null,
              ],
              ["FSSAI License", product.fssaiLicense],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.ingredients && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">Ingredients</p>
                <p className="text-sm">{product.ingredients}</p>
              </div>
            )}
            {product.nutritionalInfo && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Nutritional Information
                </p>
                <p className="text-sm">{product.nutritionalInfo}</p>
              </div>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {product.isOrganic && <Badge variant="secondary">Organic</Badge>}
              {product.isVegan && <Badge variant="secondary">Vegan</Badge>}
              {product.isVegetarian && (
                <Badge variant="secondary">Vegetarian</Badge>
              )}
              {product.isGlutenFree && (
                <Badge variant="secondary">Gluten Free</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {product.productType === PRODUCT_TYPE.BABY_CARE && (
        <Card>
          <CardHeader>
            <CardTitle>Baby Care Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Sub-Type", product.productSubType],
              ["Age Range", product.ageRange],
              ["Size", product.size],
              ["Pack Quantity", product.packQuantity],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.usageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Usage Instructions
                </p>
                <p className="text-sm">{product.usageInstructions}</p>
              </div>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {product.isHypoallergenic && (
                <Badge variant="secondary">Hypoallergenic</Badge>
              )}
              {product.isDermatologicallyTested && (
                <Badge variant="secondary">Derm. Tested</Badge>
              )}
              {product.isFragranceFree && (
                <Badge variant="secondary">Fragrance Free</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {product.productType === PRODUCT_TYPE.COSMETIC && (
        <Card>
          <CardHeader>
            <CardTitle>Cosmetic Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Category", product.cosmeticCategory],
              ["Skin Type", product.skinType],
              ["SPF Rating", product.spfRating],
              ["Fragrance Type", product.fragranceType],
              [
                "Expiry After Opening",
                product.expiryMonthsAfterOpening
                  ? `${product.expiryMonthsAfterOpening} months`
                  : null,
              ],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.ingredients && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">Ingredients</p>
                <p className="text-sm">{product.ingredients}</p>
              </div>
            )}
            {product.usageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Usage Instructions
                </p>
                <p className="text-sm">{product.usageInstructions}</p>
              </div>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {product.isParabenFree && (
                <Badge variant="secondary">Paraben Free</Badge>
              )}
              {product.isCrueltyFree && (
                <Badge variant="secondary">Cruelty Free</Badge>
              )}
              {product.dermatologicallyTested && (
                <Badge variant="secondary">Derm. Tested</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {product.productType === PRODUCT_TYPE.GENERAL && (
        <Card>
          <CardHeader>
            <CardTitle>General Product Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Product Category", product.productCategory],
              ["Material", product.material],
              ["Size", product.size],
              ["Pack Quantity", product.packQuantity],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.usageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Usage Instructions
                </p>
                <p className="text-sm">{product.usageInstructions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Medical Equipment Details */}
      {product.productType === PRODUCT_TYPE.MEDICAL_EQUIPMENT && (
        <Card>
          <CardHeader>
            <CardTitle>Medical Equipment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Equipment Type", product.equipmentType],
              ["Brand & Model", product.brandModel],
              ["Power Source", product.powerSource],
              [
                "Warranty",
                product.warrantyMonths
                  ? `${product.warrantyMonths} months`
                  : null,
              ],
              ["Certification No.", product.certificationNumber],
              [
                "Calibration Frequency",
                product.calibrationFrequencyDays
                  ? `Every ${product.calibrationFrequencyDays} days`
                  : null,
              ],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.specifications && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Technical Specifications
                </p>
                <p className="text-sm">{product.specifications}</p>
              </div>
            )}
            {product.usageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Usage Instructions
                </p>
                <p className="text-sm">{product.usageInstructions}</p>
              </div>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {product.requiresCalibration && (
                <Badge variant="secondary">Requires Calibration</Badge>
              )}
              {product.isCertified && (
                <Badge variant="secondary">Certified</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Surgical Details */}
      {product.productType === PRODUCT_TYPE.SURGICAL && (
        <Card>
          <CardHeader>
            <CardTitle>Surgical &amp; First Aid Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Surgical Category", product.surgicalCategory],
              ["Material", product.material],
              ["Size", product.size],
              [
                "Pack Size",
                product.packSize ? `${product.packSize} units` : null,
              ],
              ["Sterilization Method", product.sterilizationMethod],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.usageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Usage Instructions
                </p>
                <p className="text-sm">{product.usageInstructions}</p>
              </div>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {product.sterilized && (
                <Badge variant="secondary">Pre-Sterilized</Badge>
              )}
              {product.singleUse && (
                <Badge variant="secondary">Single Use Only</Badge>
              )}
              {product.isLatexFree && (
                <Badge variant="secondary">Latex Free</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ayurvedic Details */}
      {product.productType === PRODUCT_TYPE.AYURVEDIC && (
        <Card>
          <CardHeader>
            <CardTitle>Ayurvedic &amp; Herbal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Ayurvedic Type", product.ayurvedicType],
              ["AYUSH License", product.ayushLicense],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.ingredients && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Ingredients / Composition
                </p>
                <p className="text-sm">{product.ingredients}</p>
              </div>
            )}
            {product.therapeuticUses && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Therapeutic Uses
                </p>
                <p className="text-sm">{product.therapeuticUses}</p>
              </div>
            )}
            {product.dosageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Dosage Instructions
                </p>
                <p className="text-sm">{product.dosageInstructions}</p>
              </div>
            )}
            {product.contraindications && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Contraindications
                </p>
                <p className="text-sm text-amber-700">
                  {product.contraindications}
                </p>
              </div>
            )}
            {product.preparationMethod && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Preparation Method
                </p>
                <p className="text-sm">{product.preparationMethod}</p>
              </div>
            )}
            {product.isClassicalFormulation && (
              <div className="sm:col-span-2">
                <Badge variant="secondary">Classical Formulation</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Homeopathic Details */}
      {product.productType === PRODUCT_TYPE.HOMEOPATHIC && (
        <Card>
          <CardHeader>
            <CardTitle>Homeopathic Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-y-4 gap-x-8 sm:grid-cols-2">
            {[
              ["Preparation Form", product.homeopathicForm],
              ["Potency", product.potency],
              ["Mother Tincture", product.motherTincture],
              ["Pharmacopoeia", product.homeopathicPharmacopoeia],
            ].map(
              ([label, val]) =>
                val != null &&
                val !== "" && (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{val}</span>
                  </div>
                ),
            )}
            {product.indications && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">Indications</p>
                <p className="text-sm">{product.indications}</p>
              </div>
            )}
            {product.dosageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <p className="text-muted-foreground text-sm">
                  Dosage Instructions
                </p>
                <p className="text-sm">{product.dosageInstructions}</p>
              </div>
            )}
            {product.isCombinationRemedy && (
              <div className="sm:col-span-2">
                <Badge variant="secondary">Combination Remedy</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
