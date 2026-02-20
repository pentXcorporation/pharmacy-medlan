/**
 * Product Form Component
 * Reusable form for creating and editing products — supports all product types
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCw, Barcode, Info } from "lucide-react";
import { barcodeService } from "@/services";
import { toast } from "sonner";
import { productSchema } from "@/utils/validators";
import { inputRestrictions } from "@/utils/validationHelpers";
import { useActiveCategories } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DOSAGE_FORM,
  DOSAGE_FORM_LABELS,
  DRUG_SCHEDULE,
  DRUG_SCHEDULE_LABELS,
  PRODUCT_TYPE,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_PREFIXES,
  PRODUCT_TYPE_DEFAULT_GST,
  PRODUCT_TYPE_DESCRIPTIONS,
  PRODUCT_TYPE_BADGE_CLASS,
  ACTIVE_PRODUCT_TYPES,
  COMING_SOON_PRODUCT_TYPES,
  SUPPLEMENT_TYPE_OPTIONS,
  FOOD_CATEGORY_OPTIONS,
  BABY_CARE_SUBTYPE_OPTIONS,
  COSMETIC_CATEGORY_OPTIONS,
  SKIN_TYPE_OPTIONS,
} from "@/constants";

/**
 * ProductForm component
 */
const ProductForm = ({ product, onSubmit, isSubmitting = false, onCancel }) => {
  const { data: categories = [], isLoading: loadingCategories } =
    useActiveCategories();

  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [isGeneratingBarcode, setIsGeneratingBarcode] = useState(false);
  const isEditing = Boolean(product);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: "MEDICAL",
      productName: "",
      genericName: "",
      categoryId: "",
      manufacturer: "",
      barcode: "",
      description: "",
      costPrice: "",
      sellingPrice: "",
      mrp: "",
      gstRate: "",
      reorderLevel: "",
      minimumStock: "",
      maximumStock: "",
      // Medical
      dosageForm: "",
      strength: "",
      drugSchedule: "",
      isPrescriptionRequired: false,
      isNarcotic: false,
      isRefrigerated: false,
      // Supplement
      supplementType: "",
      activeIngredients: "",
      dosageInstructions: "",
      servingSize: "",
      servingsPerContainer: "",
      ageGroup: "",
      warnings: "",
      isFdaApproved: false,
      isCertifiedOrganic: false,
      // Food
      foodCategory: "",
      ingredients: "",
      nutritionalInfo: "",
      allergenInfo: "",
      shelfLifeDays: "",
      fssaiLicense: "",
      isOrganic: false,
      isVegan: false,
      isVegetarian: false,
      isGlutenFree: false,
      // Baby Care
      ageRange: "",
      productSubType: "",
      size: "",
      packQuantity: "",
      usageInstructions: "",
      isHypoallergenic: false,
      isDermatologicallyTested: false,
      isFragranceFree: false,
      // Cosmetic
      cosmeticCategory: "",
      skinType: "",
      spfRating: "",
      fragranceType: "",
      expiryMonthsAfterOpening: "",
      isParabenFree: false,
      isCrueltyFree: false,
      dermatologicallyTested: false,
      // General
      productCategory: "",
      material: "",
    },
  });

  const selectedType = form.watch("productType");

  // Generate barcode for new products on initial load
  useEffect(() => {
    const generateInitialBarcode = async () => {
      if (!isEditing && !generatedBarcode) {
        try {
          setIsGeneratingBarcode(true);
          const prefix = PRODUCT_TYPE_PREFIXES["MEDICAL"];
          const response = await barcodeService.generateUnique(prefix);
          const newBarcode = response.barcode || response;
          setGeneratedBarcode(newBarcode);
          form.setValue("barcode", newBarcode);
          toast.success("Barcode generated automatically");
        } catch (error) {
          console.error("Failed to generate barcode:", error);
          toast.error("Failed to generate barcode. You can enter it manually.");
        } finally {
          setIsGeneratingBarcode(false);
        }
      }
    };

    generateInitialBarcode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Regenerate barcode and auto-set GST when product type changes (new product only)
  useEffect(() => {
    if (!isEditing && generatedBarcode) {
      const regenerateForType = async () => {
        try {
          setIsGeneratingBarcode(true);
          const prefix = PRODUCT_TYPE_PREFIXES[selectedType] || "MED";
          const response = await barcodeService.generateUnique(prefix);
          const newBarcode = response.barcode || response;
          setGeneratedBarcode(newBarcode);
          form.setValue("barcode", newBarcode);
          const defaultGst = PRODUCT_TYPE_DEFAULT_GST[selectedType];
          if (defaultGst !== undefined)
            form.setValue("gstRate", defaultGst.toString());
        } catch (error) {
          console.error("Failed to regenerate barcode on type change:", error);
        } finally {
          setIsGeneratingBarcode(false);
        }
      };
      regenerateForType();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      const existingBarcode = product.barcode || "";
      setGeneratedBarcode(existingBarcode);

      form.reset({
        productType: product.productType || "MEDICAL",
        productName: product.productName || "",
        genericName: product.genericName || "",
        categoryId:
          (product.categoryId || product.category?.id)?.toString() || "",
        manufacturer: product.manufacturer || "",
        barcode: existingBarcode,
        description: product.description || "",
        costPrice: product.costPrice?.toString() || "",
        sellingPrice: product.sellingPrice?.toString() || "",
        mrp: product.mrp?.toString() || "",
        gstRate: product.gstRate?.toString() || "",
        reorderLevel: product.reorderLevel?.toString() || "",
        minimumStock: product.minimumStock?.toString() || "",
        maximumStock: product.maximumStock?.toString() || "",
        // Medical
        dosageForm: product.dosageForm || "",
        strength: product.strength || "",
        drugSchedule: product.drugSchedule || "",
        isPrescriptionRequired: product.isPrescriptionRequired || false,
        isNarcotic: product.isNarcotic || false,
        isRefrigerated: product.isRefrigerated || false,
        // Supplement
        supplementType: product.supplementType || "",
        activeIngredients: product.activeIngredients || "",
        dosageInstructions: product.dosageInstructions || "",
        servingSize: product.servingSize || "",
        servingsPerContainer: product.servingsPerContainer?.toString() || "",
        ageGroup: product.ageGroup || "",
        warnings: product.warnings || "",
        isFdaApproved: product.isFdaApproved || false,
        isCertifiedOrganic: product.isCertifiedOrganic || false,
        // Food
        foodCategory: product.foodCategory || "",
        ingredients: product.ingredients || "",
        nutritionalInfo: product.nutritionalInfo || "",
        allergenInfo: product.allergenInfo || "",
        shelfLifeDays: product.shelfLifeDays?.toString() || "",
        fssaiLicense: product.fssaiLicense || "",
        isOrganic: product.isOrganic || false,
        isVegan: product.isVegan || false,
        isVegetarian: product.isVegetarian || false,
        isGlutenFree: product.isGlutenFree || false,
        // Baby Care
        ageRange: product.ageRange || "",
        productSubType: product.productSubType || "",
        size: product.size || "",
        packQuantity: product.packQuantity?.toString() || "",
        usageInstructions: product.usageInstructions || "",
        isHypoallergenic: product.isHypoallergenic || false,
        isDermatologicallyTested: product.isDermatologicallyTested || false,
        isFragranceFree: product.isFragranceFree || false,
        // Cosmetic
        cosmeticCategory: product.cosmeticCategory || "",
        skinType: product.skinType || "",
        spfRating: product.spfRating?.toString() || "",
        fragranceType: product.fragranceType || "",
        expiryMonthsAfterOpening:
          product.expiryMonthsAfterOpening?.toString() || "",
        isParabenFree: product.isParabenFree || false,
        isCrueltyFree: product.isCrueltyFree || false,
        dermatologicallyTested: product.dermatologicallyTested || false,
        // General
        productCategory: product.productCategory || "",
        material: product.material || "",
      });
    }
  }, [product, form, isEditing]);

  // Regenerate barcode
  const handleRegenerateBarcode = async () => {
    try {
      setIsGeneratingBarcode(true);
      const prefix = PRODUCT_TYPE_PREFIXES[selectedType] || "MED";
      const response = await barcodeService.generateUnique(prefix);
      const newBarcode = response.barcode || response;
      setGeneratedBarcode(newBarcode);
      form.setValue("barcode", newBarcode);
      setBarcodeImage(null);
      toast.success("New barcode generated");
    } catch (error) {
      console.error("Failed to regenerate barcode:", error);
      toast.error("Failed to generate new barcode");
    } finally {
      setIsGeneratingBarcode(false);
    }
  };

  const handleSubmit = (data) => {
    const formattedData = {
      ...data,
      categoryId: data.categoryId ? parseInt(data.categoryId) : null,
      dosageForm: data.dosageForm || null,
      drugSchedule: data.drugSchedule || null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
      sellingPrice: data.sellingPrice ? parseFloat(data.sellingPrice) : null,
      mrp: data.mrp ? parseFloat(data.mrp) : null,
      gstRate: data.gstRate ? parseFloat(data.gstRate) : null,
      reorderLevel: data.reorderLevel ? parseInt(data.reorderLevel) : null,
      minimumStock: data.minimumStock ? parseInt(data.minimumStock) : null,
      maximumStock: data.maximumStock ? parseInt(data.maximumStock) : null,
      // Numeric type-specific fields
      servingsPerContainer: data.servingsPerContainer
        ? parseInt(data.servingsPerContainer)
        : null,
      shelfLifeDays: data.shelfLifeDays ? parseInt(data.shelfLifeDays) : null,
      packQuantity: data.packQuantity ? parseInt(data.packQuantity) : null,
      spfRating: data.spfRating ? parseFloat(data.spfRating) : null,
      expiryMonthsAfterOpening: data.expiryMonthsAfterOpening
        ? parseInt(data.expiryMonthsAfterOpening)
        : null,
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* ── Product Type ───────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Type</CardTitle>
            <CardDescription>
              Select the type of product to configure the appropriate fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full sm:w-[360px]">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVE_PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex flex-col py-0.5">
                            <span className="font-medium">
                              {PRODUCT_TYPE_LABELS[type]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {PRODUCT_TYPE_DESCRIPTIONS[type]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <Separator className="my-1" />
                      {COMING_SOON_PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type} value={type} disabled>
                          <div className="flex flex-col py-0.5">
                            <span className="font-medium text-muted-foreground">
                              {PRODUCT_TYPE_LABELS[type]} (Coming Soon)
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {PRODUCT_TYPE_DESCRIPTIONS[type]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${PRODUCT_TYPE_BADGE_CLASS[selectedType]}`}
              >
                <Info className="h-3.5 w-3.5" />
                {PRODUCT_TYPE_LABELS[selectedType]}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Basic Information ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genericName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter generic name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={loadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingCategories ? "Loading..." : "Select category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!loadingCategories &&
                      categories &&
                      categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.categoryName}
                          </SelectItem>
                        ))
                      ) : !loadingCategories ? (
                        <SelectItem value="none" disabled>
                          No categories available
                        </SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Barcode {!isEditing && "(Auto-Generated)"}
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Generating..."
                        {...field}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    {!isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRegenerateBarcode}
                        disabled={isGeneratingBarcode}
                        title="Regenerate Barcode"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isGeneratingBarcode ? "animate-spin" : ""}`}
                        />
                      </Button>
                    )}
                  </div>
                  <FormDescription>
                    {isEditing
                      ? "Existing barcode for this product"
                      : "Unique barcode automatically generated"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Barcode Preview */}
        {generatedBarcode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Barcode className="h-5 w-5" />
                Generated Barcode Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed">
                <div className="mb-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Barcode Number
                  </p>
                  <p className="text-2xl font-mono font-bold tracking-wider">
                    {generatedBarcode}
                  </p>
                </div>
                <div className="w-full max-w-md bg-white p-4 rounded-md">
                  <svg
                    className="w-full h-24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 80"
                  >
                    {/* Simplified barcode representation - bars pattern */}
                    <rect x="10" y="10" width="3" height="50" fill="#000" />
                    <rect x="16" y="10" width="1" height="50" fill="#000" />
                    <rect x="20" y="10" width="3" height="50" fill="#000" />
                    <rect x="26" y="10" width="1" height="50" fill="#000" />
                    <rect x="30" y="10" width="2" height="50" fill="#000" />
                    <rect x="35" y="10" width="3" height="50" fill="#000" />
                    <rect x="41" y="10" width="1" height="50" fill="#000" />
                    <rect x="45" y="10" width="2" height="50" fill="#000" />
                    <rect x="50" y="10" width="3" height="50" fill="#000" />
                    <rect x="56" y="10" width="1" height="50" fill="#000" />
                    <rect x="60" y="10" width="3" height="50" fill="#000" />
                    <rect x="66" y="10" width="2" height="50" fill="#000" />
                    <rect x="71" y="10" width="1" height="50" fill="#000" />
                    <rect x="75" y="10" width="3" height="50" fill="#000" />
                    <rect x="81" y="10" width="1" height="50" fill="#000" />
                    <rect x="85" y="10" width="2" height="50" fill="#000" />
                    <rect x="90" y="10" width="3" height="50" fill="#000" />
                    <rect x="96" y="10" width="1" height="50" fill="#000" />
                    <rect x="100" y="10" width="2" height="50" fill="#000" />
                    <rect x="105" y="10" width="3" height="50" fill="#000" />
                    <rect x="111" y="10" width="1" height="50" fill="#000" />
                    <rect x="115" y="10" width="3" height="50" fill="#000" />
                    <rect x="121" y="10" width="1" height="50" fill="#000" />
                    <rect x="125" y="10" width="2" height="50" fill="#000" />
                    <rect x="130" y="10" width="3" height="50" fill="#000" />
                    <rect x="136" y="10" width="1" height="50" fill="#000" />
                    <rect x="140" y="10" width="3" height="50" fill="#000" />
                    <rect x="146" y="10" width="2" height="50" fill="#000" />
                    <rect x="151" y="10" width="1" height="50" fill="#000" />
                    <rect x="155" y="10" width="3" height="50" fill="#000" />
                    <rect x="161" y="10" width="1" height="50" fill="#000" />
                    <rect x="165" y="10" width="2" height="50" fill="#000" />
                    <rect x="170" y="10" width="3" height="50" fill="#000" />
                    <rect x="176" y="10" width="1" height="50" fill="#000" />
                    <rect x="180" y="10" width="3" height="50" fill="#000" />
                    <rect x="186" y="10" width="2" height="50" fill="#000" />
                    <text
                      x="100"
                      y="72"
                      fontSize="10"
                      textAnchor="middle"
                      fill="#000"
                    >
                      {generatedBarcode}
                    </text>
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  This barcode will be saved with the product and can be printed
                  for labels
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Medical Details ───────────────────────────────────────────────────────── */}
        {selectedType === PRODUCT_TYPE.MEDICAL && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dosageForm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage Form</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dosage form" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DOSAGE_FORM).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {DOSAGE_FORM_LABELS[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strength</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="drugSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug Schedule</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DRUG_SCHEDULE).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {DRUG_SCHEDULE_LABELS[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  {
                    name: "isPrescriptionRequired",
                    label: "Prescription Required",
                    desc: "Requires valid prescription to sell",
                  },
                  {
                    name: "isNarcotic",
                    label: "Narcotic Drug",
                    desc: "Subject to special regulations",
                  },
                  {
                    name: "isRefrigerated",
                    label: "Requires Refrigeration",
                    desc: "Must be stored in cold chain",
                  },
                ].map(({ name, label, desc }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                          <FormDescription>{desc}</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Supplement Details ────────────────────────────────────────────────────── */}
        {selectedType === PRODUCT_TYPE.SUPPLEMENT && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="supplementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplement Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplement type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUPPLEMENT_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Group</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Adults 18+" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servingSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serving Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 tablet, 30g" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servingsPerContainer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings per Container</FormLabel>
                      <FormControl>
                        <Input
                          {...inputRestrictions.positiveInteger}
                          placeholder="e.g., 60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activeIngredients"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Active Ingredients</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List key active ingredients..."
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosageInstructions"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Dosage Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Take 1 capsule daily with food..."
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warnings"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Warnings / Contraindications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any warnings or contraindications..."
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { name: "isFdaApproved", label: "FDA / FSSAI Approved" },
                  { name: "isCertifiedOrganic", label: "Certified Organic" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Food & Beverage Details ──────────────────────────────────────────── */}
        {selectedType === PRODUCT_TYPE.FOOD && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Food &amp; Beverage Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="foodCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select food category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FOOD_CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allergenInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergen Information</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Contains nuts, gluten"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shelfLifeDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shelf Life (days)</FormLabel>
                      <FormControl>
                        <Input
                          {...inputRestrictions.positiveInteger}
                          placeholder="e.g., 365"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fssaiLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FSSAI License No.</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter FSSAI license number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Ingredients</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List all ingredients..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nutritionalInfo"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nutritional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Calories, protein, carbs, fat per serving..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { name: "isOrganic", label: "Organic" },
                  { name: "isVegan", label: "Vegan" },
                  { name: "isVegetarian", label: "Vegetarian" },
                  { name: "isGlutenFree", label: "Gluten Free" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Baby Care Details ─────────────────────────────────────────────────── */}
        {selectedType === PRODUCT_TYPE.BABY_CARE && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Baby Care Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="productSubType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Sub-Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub-type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BABY_CARE_SUBTYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Range</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 0–6 months, 1–3 years"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size / Dimensions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Small, 200ml, 500g"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="packQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...inputRestrictions.positiveInteger}
                          placeholder="e.g., 20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usageInstructions"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Usage Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How to use this product..."
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { name: "isHypoallergenic", label: "Hypoallergenic" },
                  {
                    name: "isDermatologicallyTested",
                    label: "Dermatologically Tested",
                  },
                  { name: "isFragranceFree", label: "Fragrance Free" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Cosmetic Details ─────────────────────────────────────────────────────── */}
        {selectedType === PRODUCT_TYPE.COSMETIC && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cosmetic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cosmeticCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cosmetic Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COSMETIC_CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skinType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SKIN_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spfRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SPF Rating</FormLabel>
                      <FormControl>
                        <Input
                          {...inputRestrictions.positiveInteger}
                          placeholder="e.g., 30, 50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fragranceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fragrance Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Rose, Lavender, Unscented"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryMonthsAfterOpening"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry After Opening (months)</FormLabel>
                      <FormControl>
                        <Input
                          {...inputRestrictions.positiveInteger}
                          placeholder="e.g., 12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Ingredients / Formula</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List key ingredients..."
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usageInstructions"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Usage Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How to apply / use this product..."
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { name: "isParabenFree", label: "Paraben Free" },
                  { name: "isCrueltyFree", label: "Cruelty Free" },
                  {
                    name: "dermatologicallyTested",
                    label: "Dermatologically Tested",
                  },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── General Product Details ────────────────────────────────────────────── */}
        {selectedType === PRODUCT_TYPE.GENERAL && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Household, Stationery"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Plastic, Cotton, Metal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Small, 30cm x 20cm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="packQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pack Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...inputRestrictions.positiveInteger}
                        placeholder="e.g., 10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usageInstructions"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Usage / Care Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How to use or care for this product..."
                        className="min-h-[70px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* ── Pricing ────────────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Price *</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.positiveDecimal}
                      placeholder="0.00"
                      max="999999999.99"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Purchase/cost price</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price *</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.positiveDecimal}
                      placeholder="0.00"
                      max="999999999.99"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Retail price (≥ cost)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MRP</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.positiveDecimal}
                      placeholder="0.00"
                      max="999999999.99"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum Retail Price (≥ selling)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gstRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.percentage}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="reorderLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Level</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.positiveInteger}
                      placeholder="0"
                      max="999999999"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Alert when stock falls below (≥ minimum)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stock</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.positiveInteger}
                      placeholder="0"
                      max="999999999"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Lowest acceptable quantity</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximumStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Stock</FormLabel>
                  <FormControl>
                    <Input
                      {...inputRestrictions.positiveInteger}
                      placeholder="0"
                      max="999999999"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Storage capacity (&gt; reorder)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* ── Actions ────────────────────────────────────────────────────────────── */}
        {/* Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
