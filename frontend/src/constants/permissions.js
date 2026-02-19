/**
 * Role-Based Permissions Matrix
 * Maps roles to feature access levels
 */
import { ROLES } from "./roles";

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    dashboard: { view: true },
    users: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      resetPassword: true,
    },
    branches: { view: true, create: true, edit: true, delete: true },
    categories: { view: true, create: true, edit: true, delete: true },
    products: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      pricing: true,
    },
    inventory: { view: true, adjust: true, transfer: true, receive: true },
    purchaseOrders: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      reject: true,
    },
    grn: { view: true, create: true, approve: true, reject: true },
    sales: {
      view: true,
      create: true,
      cancel: true,
      void: true,
      discount: 100,
      credit: true,
      creditLimit: Infinity,
    },
    returns: { view: true, create: true, approve: true },
    customers: { view: true, create: true, edit: true, delete: true },
    suppliers: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, export: true },
    finance: { view: true, manage: true },
    payroll: { view: true, manage: true },
    settings: { view: true, edit: true },
    audit: { view: true },
  },

  [ROLES.ADMIN]: {
    dashboard: { view: true },
    users: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      resetPassword: true,
    },
    branches: { view: true, create: false, edit: true, delete: false },
    categories: { view: true, create: true, edit: true, delete: true },
    products: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      pricing: true,
    },
    inventory: { view: true, adjust: true, transfer: true, receive: true },
    purchaseOrders: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      reject: true,
    },
    grn: { view: true, create: true, approve: true, reject: true },
    sales: {
      view: true,
      create: true,
      cancel: true,
      void: false,
      discount: 20,
      credit: true,
      creditLimit: 50000,
    },
    returns: { view: true, create: true, approve: true },
    customers: { view: true, create: true, edit: true, delete: false },
    suppliers: { view: true, create: true, edit: true, delete: false },
    reports: { view: true, export: true },
    finance: { view: true, manage: true },
    payroll: { view: true, manage: false },
    settings: { view: true, edit: false },
    audit: { view: true },
  },

  [ROLES.OWNER]: {
    dashboard: { view: true },
    users: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      resetPassword: true,
    },
    branches: { view: true, create: true, edit: true, delete: true },
    categories: { view: true, create: true, edit: true, delete: true },
    products: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      pricing: true,
    },
    inventory: { view: true, adjust: true, transfer: true, receive: true },
    purchaseOrders: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      reject: true,
    },
    grn: { view: true, create: true, approve: true, reject: true },
    sales: {
      view: true,
      create: true,
      cancel: true,
      void: true,
      discount: 100,
      credit: true,
      creditLimit: Infinity,
    },
    returns: { view: true, create: true, approve: true },
    customers: { view: true, create: true, edit: true, delete: true },
    suppliers: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, export: true },
    finance: { view: true, manage: true },
    payroll: { view: true, manage: true },
    settings: { view: true, edit: true },
    audit: { view: true },
  },

  [ROLES.BRANCH_MANAGER]: {
    dashboard: { view: true },
    users: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      resetPassword: false,
    },
    branches: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: false, edit: false, delete: false },
    products: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      pricing: false,
    },
    inventory: { view: true, adjust: true, transfer: true, receive: false },
    purchaseOrders: {
      view: true,
      create: true,
      edit: true,
      approve: false,
      reject: false,
    },
    grn: { view: true, create: false, approve: false, reject: false },
    sales: {
      view: true,
      create: true,
      cancel: true,
      void: false,
      discount: 15,
      credit: true,
      creditLimit: 20000,
    },
    returns: { view: true, create: true, approve: true },
    customers: { view: true, create: true, edit: true, delete: false },
    suppliers: { view: true, create: false, edit: false, delete: false },
    reports: { view: true, export: true },
    finance: { view: true, manage: false },
    payroll: { view: false, manage: false },
    settings: { view: false, edit: false },
    audit: { view: false },
  },

  [ROLES.MANAGER]: {
    dashboard: { view: true },
    users: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      resetPassword: false,
    },
    branches: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: true, edit: true, delete: false },
    products: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      pricing: false,
    },
    inventory: { view: true, adjust: true, transfer: true, receive: true },
    purchaseOrders: {
      view: true,
      create: true,
      edit: true,
      approve: true,
      reject: true,
    },
    grn: { view: true, create: true, approve: true, reject: true },
    sales: {
      view: true,
      create: true,
      cancel: true,
      void: false,
      discount: 15,
      credit: true,
      creditLimit: 20000,
    },
    returns: { view: true, create: true, approve: true },
    customers: { view: true, create: true, edit: true, delete: false },
    suppliers: { view: true, create: true, edit: true, delete: false },
    reports: { view: true, export: true },
    finance: { view: true, manage: false },
    payroll: { view: false, manage: false },
    settings: { view: false, edit: false },
    audit: { view: false },
  },

  [ROLES.PHARMACIST]: {
    dashboard: { view: true },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      resetPassword: false,
    },
    branches: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: false, edit: false, delete: false },
    products: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      pricing: false,
    },
    inventory: { view: true, adjust: false, transfer: false, receive: false },
    purchaseOrders: {
      view: false,
      create: false,
      edit: false,
      approve: false,
      reject: false,
    },
    grn: { view: false, create: false, approve: false, reject: false },
    sales: {
      view: true,
      create: true,
      cancel: false,
      void: false,
      discount: 10,
      credit: true,
      creditLimit: 5000,
    },
    returns: { view: true, create: true, approve: false },
    customers: { view: true, create: true, edit: true, delete: false },
    suppliers: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, export: false },
    finance: { view: false, manage: false },
    payroll: { view: false, manage: false },
    settings: { view: false, edit: false },
    audit: { view: false },
    prescriptions: { view: true, create: true, verify: true },
  },

  [ROLES.CASHIER]: {
    dashboard: { view: true },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      resetPassword: false,
    },
    branches: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: false, edit: false, delete: false },
    products: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      pricing: false,
    },
    inventory: { view: true, adjust: false, transfer: false, receive: false },
    purchaseOrders: {
      view: false,
      create: false,
      edit: false,
      approve: false,
      reject: false,
    },
    grn: { view: false, create: false, approve: false, reject: false },
    sales: {
      view: true,
      create: true,
      cancel: false,
      void: false,
      discount: 5,
      credit: false,
      creditLimit: 0,
    },
    returns: { view: true, create: true, approve: false },
    customers: { view: true, create: true, edit: false, delete: false },
    suppliers: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, export: false },
    finance: { view: false, manage: false },
    payroll: { view: false, manage: false },
    settings: { view: false, edit: false },
    audit: { view: false },
  },

  [ROLES.INVENTORY_MANAGER]: {
    dashboard: { view: true },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      resetPassword: false,
    },
    branches: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: true, edit: true, delete: false },
    products: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      pricing: false,
    },
    inventory: { view: true, adjust: true, transfer: true, receive: true },
    purchaseOrders: {
      view: true,
      create: true,
      edit: true,
      approve: false,
      reject: false,
    },
    grn: { view: true, create: true, approve: false, reject: false },
    sales: {
      view: false,
      create: false,
      cancel: false,
      void: false,
      discount: 0,
      credit: false,
      creditLimit: 0,
    },
    returns: { view: true, create: false, approve: false },
    customers: { view: false, create: false, edit: false, delete: false },
    suppliers: { view: true, create: true, edit: true, delete: false },
    reports: { view: true, export: true },
    finance: { view: false, manage: false },
    payroll: { view: false, manage: false },
    settings: { view: false, edit: false },
    audit: { view: false },
  },

  [ROLES.ACCOUNTANT]: {
    dashboard: { view: true },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      resetPassword: false,
    },
    branches: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: false, edit: false, delete: false },
    products: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      pricing: true,
    },
    inventory: { view: true, adjust: false, transfer: false, receive: false },
    purchaseOrders: {
      view: true,
      create: false,
      edit: false,
      approve: true,
      reject: true,
    },
    grn: { view: true, create: false, approve: true, reject: true },
    sales: {
      view: true,
      create: false,
      cancel: false,
      void: false,
      discount: 0,
      credit: false,
      creditLimit: 0,
    },
    returns: { view: true, create: false, approve: true },
    customers: { view: true, create: false, edit: false, delete: false },
    suppliers: { view: true, create: false, edit: false, delete: false },
    reports: { view: true, export: true },
    finance: { view: true, manage: true },
    payroll: { view: true, manage: false },
    settings: { view: false, edit: false },
    audit: { view: true },
  },
};

/**
 * Check if a role has permission for a feature action
 * @param {string} role - User role
 * @param {string} feature - Feature name (e.g., 'products', 'sales')
 * @param {string} action - Action name (e.g., 'view', 'create', 'edit')
 * @returns {boolean}
 */
export const hasPermission = (role, feature, action) => {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  const featurePermissions = rolePermissions[feature];
  if (!featurePermissions) return false;

  return featurePermissions[action] === true;
};

/**
 * Get the maximum discount percentage for a role
 * @param {string} role - User role
 * @returns {number}
 */
export const getMaxDiscount = (role) => {
  return PERMISSIONS[role]?.sales?.discount || 0;
};

/**
 * Check if role can give credit
 * @param {string} role - User role
 * @returns {boolean}
 */
export const canGiveCredit = (role) => {
  return PERMISSIONS[role]?.sales?.credit || false;
};

/**
 * Get credit limit for a role
 * @param {string} role - User role
 * @returns {number}
 */
export const getCreditLimit = (role) => {
  return PERMISSIONS[role]?.sales?.creditLimit || 0;
};
