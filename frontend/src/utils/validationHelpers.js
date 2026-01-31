/**
 * Validation Helper Functions
 * Centralized validation utilities for forms
 */

import { z } from "zod";

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[0-9+\-() ]{7,20}$/,
  alphanumeric: /^[a-zA-Z0-9\s]*$/,
  numeric: /^[0-9]*$/,
  decimal: /^\d+(\.\d{1,2})?$/,
  positiveInteger: /^[1-9][0-9]*$/,
  nic: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
};

/**
 * String validators
 */
export const stringValidators = {
  required: (fieldName = "Field") =>
    z.string().min(1, `${fieldName} is required`).trim(),
  
  email: () =>
    z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(100, "Email must be less than 100 characters")
      .toLowerCase()
      .trim(),
  
  phone: () =>
    z
      .string()
      .min(7, "Phone number must be at least 7 digits")
      .max(20, "Phone number must be less than 20 characters")
      .regex(validationPatterns.phone, "Invalid phone number format"),
  
  optionalPhone: () =>
    z
      .string()
      .optional()
      .refine(
        (val) => !val || validationPatterns.phone.test(val),
        "Invalid phone number format"
      ),
  
  nic: () =>
    z
      .string()
      .regex(
        validationPatterns.nic,
        "Invalid NIC format (should be 9 digits + V/X or 12 digits)"
      ),
  
  maxLength: (fieldName, max) =>
    z
      .string()
      .max(max, `${fieldName} must be less than ${max} characters`)
      .trim(),
  
  minMaxLength: (fieldName, min, max) =>
    z
      .string()
      .min(min, `${fieldName} must be at least ${min} characters`)
      .max(max, `${fieldName} must be less than ${max} characters`)
      .trim(),
};

/**
 * Number validators
 */
export const numberValidators = {
  positive: (fieldName = "Value") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .positive(`${fieldName} must be positive`)
      .finite(`${fieldName} must be a valid number`),
  
  positiveOrZero: (fieldName = "Value") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .min(0, `${fieldName} must be 0 or greater`)
      .finite(`${fieldName} must be a valid number`),
  
  integer: (fieldName = "Value") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .int(`${fieldName} must be a whole number`)
      .finite(`${fieldName} must be a valid number`),
  
  positiveInteger: (fieldName = "Value") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .int(`${fieldName} must be a whole number`)
      .positive(`${fieldName} must be greater than 0`)
      .finite(`${fieldName} must be a valid number`),
  
  range: (fieldName, min, max) =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .min(min, `${fieldName} must be at least ${min}`)
      .max(max, `${fieldName} must be at most ${max}`)
      .finite(`${fieldName} must be a valid number`),
  
  percentage: (fieldName = "Percentage") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .min(0, `${fieldName} must be between 0 and 100`)
      .max(100, `${fieldName} must be between 0 and 100`)
      .finite(`${fieldName} must be a valid number`),
  
  price: (fieldName = "Price") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .min(0.01, `${fieldName} must be at least 0.01`)
      .max(999999999.99, `${fieldName} is too large`)
      .finite(`${fieldName} must be a valid number`),
  
  quantity: (fieldName = "Quantity") =>
    z
      .number({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a number`,
      })
      .int(`${fieldName} must be a whole number`)
      .min(1, `${fieldName} must be at least 1`)
      .max(1000000, `${fieldName} is too large`)
      .finite(`${fieldName} must be a valid number`),
};

/**
 * Date validators
 */
export const dateValidators = {
  required: (fieldName = "Date") =>
    z.string().min(1, `${fieldName} is required`),
  
  pastOrToday: (fieldName = "Date") =>
    z
      .string()
      .min(1, `${fieldName} is required`)
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      }, `${fieldName} cannot be in the future`),
  
  futureOrToday: (fieldName = "Date") =>
    z
      .string()
      .min(1, `${fieldName} is required`)
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }, `${fieldName} cannot be in the past`),
  
  future: (fieldName = "Date") =>
    z
      .string()
      .min(1, `${fieldName} is required`)
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate > today;
      }, `${fieldName} must be in the future`),
  
  manufacturingDate: () =>
    z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;
        const mfgDate = new Date(date);
        const today = new Date();
        return mfgDate <= today;
      }, "Manufacturing date cannot be in the future"),
  
  expiryDate: () =>
    z
      .string()
      .min(1, "Expiry date is required")
      .refine((date) => {
        const expiryDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return expiryDate > today;
      }, "Expiry date must be in the future"),
  
  dateRange: (startDate, endDate, fieldName = "Date range") =>
    z.object({}).refine(
      () => {
        if (!startDate || !endDate) return true;
        return new Date(startDate) <= new Date(endDate);
      },
      {
        message: `${fieldName}: End date must be after start date`,
      }
    ),
};

/**
 * Array validators
 */
export const arrayValidators = {
  minLength: (fieldName, min) =>
    z
      .array(z.any())
      .min(min, `At least ${min} ${fieldName} ${min === 1 ? "is" : "are"} required`),
  
  maxLength: (fieldName, max) =>
    z
      .array(z.any())
      .max(max, `Maximum ${max} ${fieldName} allowed`),
  
  minMaxLength: (fieldName, min, max) =>
    z
      .array(z.any())
      .min(min, `At least ${min} ${fieldName} required`)
      .max(max, `Maximum ${max} ${fieldName} allowed`),
};

/**
 * Sanitization functions
 */
export const sanitize = {
  string: (value) => {
    if (!value || typeof value !== "string") return value;
    return value.trim().replace(/\s+/g, " ");
  },
  
  number: (value) => {
    if (value === "" || value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  },
  
  positiveNumber: (value) => {
    const num = sanitize.number(value);
    return num < 0 ? 0 : num;
  },
  
  email: (value) => {
    if (!value || typeof value !== "string") return value;
    return value.trim().toLowerCase();
  },
  
  phone: (value) => {
    if (!value || typeof value !== "string") return value;
    return value.replace(/\s+/g, "");
  },
};

/**
 * Custom validation rules
 */
export const customValidators = {
  // Price validations
  sellingPriceGreaterThanCost: (costPrice, sellingPrice) =>
    sellingPrice >= costPrice || "Selling price should be greater than or equal to cost price",
  
  mrpGreaterThanSellingPrice: (sellingPrice, mrp) =>
    mrp >= sellingPrice || "MRP should be greater than or equal to selling price",
  
  // Discount validations
  discountLessThanTotal: (total, discount) =>
    discount <= total || "Discount cannot exceed total amount",
  
  // Stock validations
  quantityAvailable: (available, requested) =>
    requested <= available || `Only ${available} units available`,
  
  // Date validations
  expiryAfterManufacturing: (mfgDate, expiryDate) => {
    if (!mfgDate || !expiryDate) return true;
    return new Date(expiryDate) > new Date(mfgDate) || "Expiry date must be after manufacturing date";
  },
};

/**
 * Input restrictions for HTML inputs
 */
export const inputRestrictions = {
  positiveInteger: {
    type: "number",
    min: "1",
    step: "1",
    onKeyDown: (e) => {
      if (e.key === "." || e.key === "-" || e.key === "e" || e.key === "E") {
        e.preventDefault();
      }
    },
  },
  
  positiveDecimal: {
    type: "number",
    min: "0.01",
    step: "0.01",
    onKeyDown: (e) => {
      if (e.key === "-" || e.key === "e" || e.key === "E") {
        e.preventDefault();
      }
    },
  },
  
  nonNegativeInteger: {
    type: "number",
    min: "0",
    step: "1",
    onKeyDown: (e) => {
      if (e.key === "." || e.key === "-" || e.key === "e" || e.key === "E") {
        e.preventDefault();
      }
    },
  },
  
  percentage: {
    type: "number",
    min: "0",
    max: "100",
    step: "0.01",
    onKeyDown: (e) => {
      if (e.key === "-" || e.key === "e" || e.key === "E") {
        e.preventDefault();
      }
    },
  },
};
