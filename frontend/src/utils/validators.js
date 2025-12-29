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
    "Username must be at least 3 characters"
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
    "Code must be 10 characters or less"
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

export const productSchema = z.object({
  productName: requiredString("Product name"),
  genericName: optionalString,
  categoryId: optionalString,
  dosageForm: optionalString,
  strength: optionalString,
  drugSchedule: optionalString,
  manufacturer: optionalString,
  barcode: optionalString,
  description: optionalString,
  costPrice: optionalString,
  sellingPrice: optionalString,
  mrp: optionalString,
  gstRate: optionalString,
  reorderLevel: optionalString,
  minimumStock: optionalString,
  maximumStock: optionalString,
  isPrescriptionRequired: z.boolean().default(false),
  isNarcotic: z.boolean().default(false),
  isRefrigerated: z.boolean().default(false),
});

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  name: requiredString("Category name"),
  code: requiredString("Category code").max(
    10,
    "Code must be 10 characters or less"
  ),
  description: optionalString,
  isActive: z.boolean().default(true),
});

export const subCategorySchema = z.object({
  name: requiredString("Sub-category name"),
  code: requiredString("Sub-category code").max(
    10,
    "Code must be 10 characters or less"
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
