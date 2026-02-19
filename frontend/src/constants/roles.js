/**
 * User Roles - Matching backend Role.java enum exactly
 * Backend roles: SUPER_ADMIN, ADMIN, OWNER, BRANCH_MANAGER, MANAGER,
 *                PHARMACIST, CASHIER, INVENTORY_MANAGER, ACCOUNTANT
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  BRANCH_MANAGER: "BRANCH_MANAGER",
  MANAGER: "MANAGER",
  PHARMACIST: "PHARMACIST",
  CASHIER: "CASHIER",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  ACCOUNTANT: "ACCOUNTANT",
  // Backward-compatible aliases
  BRANCH_ADMIN: "BRANCH_MANAGER",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.OWNER]: "Owner",
  [ROLES.BRANCH_MANAGER]: "Branch Manager",
  [ROLES.MANAGER]: "Manager",
  [ROLES.PHARMACIST]: "Pharmacist",
  [ROLES.CASHIER]: "Cashier",
  [ROLES.INVENTORY_MANAGER]: "Inventory Manager",
  [ROLES.ACCOUNTANT]: "Accountant",
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: "#9333ea", // purple-600
  [ROLES.ADMIN]: "#2563eb", // blue-600
  [ROLES.OWNER]: "#1d4ed8", // blue-700
  [ROLES.BRANCH_MANAGER]: "#16a34a", // green-600
  [ROLES.MANAGER]: "#15803d", // green-700
  [ROLES.PHARMACIST]: "#0891b2", // cyan-600
  [ROLES.CASHIER]: "#ca8a04", // yellow-600
  [ROLES.INVENTORY_MANAGER]: "#ea580c", // orange-600
  [ROLES.ACCOUNTANT]: "#db2777", // pink-600
};

/**
 * Role hierarchy for authorization checks
 * Matches backend SecurityConfig role hierarchy:
 *   SUPER_ADMIN > ADMIN, SUPER_ADMIN > OWNER
 *   ADMIN > BRANCH_MANAGER, OWNER > BRANCH_MANAGER
 *   BRANCH_MANAGER > MANAGER
 *   MANAGER > PHARMACIST, MANAGER > INVENTORY_MANAGER, MANAGER > ACCOUNTANT
 *   PHARMACIST > CASHIER
 */
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 8,
  [ROLES.ADMIN]: 7,
  [ROLES.OWNER]: 7,
  [ROLES.BRANCH_MANAGER]: 6,
  [ROLES.MANAGER]: 5,
  [ROLES.ACCOUNTANT]: 4,
  [ROLES.INVENTORY_MANAGER]: 3,
  [ROLES.PHARMACIST]: 2,
  [ROLES.CASHIER]: 1,
};

/**
 * Convenience arrays for common role groups
 */
export const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OWNER];
export const MANAGEMENT_ROLES = [...ADMIN_ROLES, ROLES.BRANCH_MANAGER, ROLES.MANAGER];
export const ALL_ROLES = [
  ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OWNER,
  ROLES.BRANCH_MANAGER, ROLES.MANAGER,
  ROLES.PHARMACIST, ROLES.CASHIER,
  ROLES.INVENTORY_MANAGER, ROLES.ACCOUNTANT,
];

export const getRoleLabel = (role) => ROLE_LABELS[role] || role;
export const getRoleColor = (role) => ROLE_COLORS[role] || "#6b7280";
