/**
 * Form Validation Schemas
 * Zod schemas for form validation
 */
import { z } from "zod";

// ============================================
// COMMON VALIDATION PATTERNS
// ============================================

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format");

export const nicSchema = z
  .string()
  .regex(/^([0-9]{9}[vVxX]|[0-9]{12})$/, "Invalid NIC format");

export const requiredString = (fieldName = "This field") =>
  z.string().min(1, `${fieldName} is required`);

export const optionalString = z.string().optional().or(z.literal(""));

export const positiveNumber = (fieldName = "Value") =>
  z.number().positive(`${fieldName} must be positive`);

export const nonNegativeNumber = (fieldName = "Value") =>
  z.number().min(0, `${fieldName} cannot be negative`);

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  username: requiredString("Username"),
  password: requiredString("Password"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: requiredString("Current password"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// ============================================
// USER SCHEMAS
// ============================================

export const userSchema = z.object({
  username: requiredString("Username").min(
    3,
    "Username must be at least 3 characters",
  ),
  email: emailSchema,
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  phone: phoneSchema.optional().or(z.literal("")),
  role: requiredString("Role"),
  branchId: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const createUserSchema = userSchema.extend({
  password: passwordSchema,
});

// ============================================
// BRANCH SCHEMAS
// ============================================

export const branchSchema = z.object({
  name: requiredString("Branch name"),
  code: requiredString("Branch code").max(
    10,
    "Code must be 10 characters or less",
  ),
  address: optionalString,
  city: optionalString,
  phone: phoneSchema.optional().or(z.literal("")),
  email: emailSchema.optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

// ============================================
// PRODUCT SCHEMAS
// ============================================

export const productSchema = z
  .object({
    // ── Common fields ───────────────────────────────────────────────────────────
    productType: z
      .string()
      .min(1, "Product type is required")
      .default("MEDICAL"),
    productName: requiredString("Product name"),
    genericName: optionalString,
    categoryId: requiredString("Category"),
    subCategoryId: optionalString,
    manufacturer: optionalString,
    barcode: optionalString,
    description: optionalString,
    costPrice: z.string().optional().or(z.literal("")),
    sellingPrice: z.string().optional().or(z.literal("")),
    mrp: z.string().optional().or(z.literal("")),
    gstRate: z.string().optional().or(z.literal("")),
    reorderLevel: z.string().optional().or(z.literal("")),
    minimumStock: z.string().optional().or(z.literal("")),
    maximumStock: z.string().optional().or(z.literal("")),

    // ── Medical fields ──────────────────────────────────────────────────────────
    dosageForm: optionalString,
    strength: optionalString,
    drugSchedule: optionalString,
    isPrescriptionRequired: z.boolean().default(false),
    isNarcotic: z.boolean().default(false),
    isRefrigerated: z.boolean().default(false),

    // ── Supplement fields ────────────────────────────────────────────────────────
    supplementType: optionalString,
    activeIngredients: optionalString,
    dosageInstructions: optionalString,
    servingSize: optionalString,
    servingsPerContainer: z.string().optional().or(z.literal("")),
    ageGroup: optionalString,
    warnings: optionalString,
    isFdaApproved: z.boolean().default(false),
    isCertifiedOrganic: z.boolean().default(false),

    // ── Food fields ─────────────────────────────────────────────────────────────
    foodCategory: optionalString,
    ingredients: optionalString,
    nutritionalInfo: optionalString,
    allergenInfo: optionalString,
    shelfLifeDays: z.string().optional().or(z.literal("")),
    fssaiLicense: optionalString,
    isOrganic: z.boolean().default(false),
    isVegan: z.boolean().default(false),
    isVegetarian: z.boolean().default(false),
    isGlutenFree: z.boolean().default(false),

    // ── Baby Care fields ─────────────────────────────────────────────────────────
    ageRange: optionalString,
    productSubType: optionalString,
    size: optionalString,
    packQuantity: z.string().optional().or(z.literal("")),
    usageInstructions: optionalString,
    isHypoallergenic: z.boolean().default(false),
    isDermatologicallyTested: z.boolean().default(false),
    isFragranceFree: z.boolean().default(false),

    // ── Cosmetic fields ──────────────────────────────────────────────────────────
    cosmeticCategory: optionalString,
    skinType: optionalString,
    spfRating: z.string().optional().or(z.literal("")),
    fragranceType: optionalString,
    expiryMonthsAfterOpening: z.string().optional().or(z.literal("")),
    isParabenFree: z.boolean().default(false),
    isCrueltyFree: z.boolean().default(false),
    dermatologicallyTested: z.boolean().default(false),

    // ── General fields ───────────────────────────────────────────────────────────
    productCategory: optionalString,
    material: optionalString,

    // ── Medical Equipment fields ──────────────────────────────────────────────────
    equipmentType: optionalString,
    brandModel: optionalString,
    specifications: optionalString,
    warrantyMonths: z.string().optional().or(z.literal("")),
    powerSource: optionalString,
    requiresCalibration: z.boolean().default(false),
    calibrationFrequencyDays: z.string().optional().or(z.literal("")),
    isCertified: z.boolean().default(false),
    certificationNumber: optionalString,

    // ── Surgical fields ───────────────────────────────────────────────────────────
    surgicalCategory: optionalString,
    packSize: z.string().optional().or(z.literal("")),
    sterilizationMethod: optionalString,
    sterilized: z.boolean().default(false),
    singleUse: z.boolean().default(false),
    isLatexFree: z.boolean().default(false),

    // ── Ayurvedic fields ──────────────────────────────────────────────────────────
    ayurvedicType: optionalString,
    ayushLicense: optionalString,
    therapeuticUses: optionalString,
    contraindications: optionalString,
    preparationMethod: optionalString,
    isClassicalFormulation: z.boolean().default(false),

    // ── Homeopathic fields ────────────────────────────────────────────────────────
    potency: optionalString,
    motherTincture: optionalString,
    indications: optionalString,
    homeopathicForm: optionalString,
    homeopathicPharmacopoeia: optionalString,
    isCombinationRemedy: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.sellingPrice || !data.costPrice) return true;
      const selling = parseFloat(data.sellingPrice);
      const cost = parseFloat(data.costPrice);
      return isNaN(selling) || isNaN(cost) || selling >= cost;
    },
    {
      message: "Selling price should be greater than or equal to cost price",
      path: ["sellingPrice"],
    },
  )
  .refine(
    (data) => {
      if (!data.mrp || !data.sellingPrice) return true;
      const mrp = parseFloat(data.mrp);
      const selling = parseFloat(data.sellingPrice);
      return isNaN(mrp) || isNaN(selling) || mrp >= selling;
    },
    {
      message: "MRP should be greater than or equal to selling price",
      path: ["mrp"],
    },
  )
  .refine(
    (data) => {
      if (!data.minimumStock || !data.reorderLevel) return true;
      const min = parseInt(data.minimumStock);
      const reorder = parseInt(data.reorderLevel);
      return isNaN(min) || isNaN(reorder) || reorder >= min;
    },
    {
      message: "Reorder level should be greater than or equal to minimum stock",
      path: ["reorderLevel"],
    },
  )
  .refine(
    (data) => {
      if (!data.maximumStock || !data.reorderLevel) return true;
      const max = parseInt(data.maximumStock);
      const reorder = parseInt(data.reorderLevel);
      return isNaN(max) || isNaN(reorder) || max > reorder;
    },
    {
      message: "Maximum stock should be greater than reorder level",
      path: ["maximumStock"],
    },
  );

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  name: requiredString("Category name"),
  code: requiredString("Category code").max(
    10,
    "Code must be 10 characters or less",
  ),
  description: optionalString,
  isActive: z.boolean().default(true),
});

export const subCategorySchema = z.object({
  name: requiredString("Sub-category name"),
  code: requiredString("Sub-category code").max(
    10,
    "Code must be 10 characters or less",
  ),
  categoryId: z.number({ required_error: "Parent category is required" }),
  description: optionalString,
  isActive: z.boolean().default(true),
});

// ============================================
// SUPPLIER SCHEMAS
// ============================================

export const supplierSchema = z.object({
  name: requiredString("Supplier name"),
  code: requiredString("Supplier code"),
  contactPerson: optionalString,
  phone: phoneSchema.optional().or(z.literal("")),
  email: emailSchema.optional().or(z.literal("")),
  address: optionalString,
  city: optionalString,
  taxNumber: optionalString,
  paymentTerms: z.number().default(30),
  creditLimit: nonNegativeNumber("Credit limit").default(0),
  isActive: z.boolean().default(true),
});

// ============================================
// CUSTOMER SCHEMAS
// ============================================

export const customerSchema = z.object({
  name: requiredString("Customer name"),
  code: optionalString,
  phone: phoneSchema.optional().or(z.literal("")),
  email: emailSchema.optional().or(z.literal("")),
  address: optionalString,
  city: optionalString,
  nic: nicSchema.optional().or(z.literal("")),
  creditLimit: nonNegativeNumber("Credit limit").default(0),
  isActive: z.boolean().default(true),
});

// ============================================
// PURCHASE ORDER SCHEMAS
// ============================================

export const purchaseOrderItemSchema = z.object({
  productId: z.number({ required_error: "Product is required" }),
  quantity: positiveNumber("Quantity"),
  unitPrice: positiveNumber("Unit price"),
  discount: nonNegativeNumber("Discount").default(0),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.number({ required_error: "Supplier is required" }),
  branchId: z.number({ required_error: "Branch is required" }),
  expectedDate: z.date().optional(),
  notes: optionalString,
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "At least one item is required"),
});

// ============================================
// GRN SCHEMAS
// ============================================

export const grnItemSchema = z.object({
  productId: z.number({ required_error: "Product is required" }),
  quantity: positiveNumber("Quantity"),
  batchNumber: requiredString("Batch number"),
  expiryDate: z.date({ required_error: "Expiry date is required" }),
  manufacturingDate: z.date().optional(),
  costPrice: positiveNumber("Cost price"),
  sellingPrice: positiveNumber("Selling price"),
  mrp: positiveNumber("MRP"),
});

export const grnSchema = z.object({
  purchaseOrderId: z.number().optional(),
  supplierId: z.number({ required_error: "Supplier is required" }),
  branchId: z.number({ required_error: "Branch is required" }),
  invoiceNumber: optionalString,
  invoiceDate: z.date().optional(),
  notes: optionalString,
  items: z.array(grnItemSchema).min(1, "At least one item is required"),
});

// ============================================
// STOCK TRANSFER SCHEMAS
// ============================================

export const stockTransferItemSchema = z.object({
  productId: z.number({ required_error: "Product is required" }),
  batchId: z.number({ required_error: "Batch is required" }),
  quantity: positiveNumber("Quantity"),
});

export const stockTransferSchema = z
  .object({
    fromBranchId: z.number({ required_error: "Source branch is required" }),
    toBranchId: z.number({ required_error: "Destination branch is required" }),
    notes: optionalString,
    items: z
      .array(stockTransferItemSchema)
      .min(1, "At least one item is required"),
  })
  .refine((data) => data.fromBranchId !== data.toBranchId, {
    message: "Source and destination branches must be different",
    path: ["toBranchId"],
  });

// ============================================
// SALE SCHEMAS
// ============================================

export const saleItemSchema = z.object({
  productId: z.number({ required_error: "Product is required" }),
  batchId: z.number({ required_error: "Batch is required" }),
  quantity: positiveNumber("Quantity"),
  unitPrice: positiveNumber("Unit price"),
  discount: nonNegativeNumber("Discount").default(0),
});

export const saleSchema = z.object({
  customerId: z.number().optional(),
  branchId: z.number({ required_error: "Branch is required" }),
  paymentMethod: requiredString("Payment method"),
  notes: optionalString,
  items: z.array(saleItemSchema).min(1, "At least one item is required"),
});

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate data against a schema
 * @param {z.ZodSchema} schema - Zod schema
 * @param {object} data - Data to validate
 * @returns {object} { success, data, errors }
 */
export const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }

  const errors = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return { success: false, data: null, errors };
};
