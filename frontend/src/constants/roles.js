/**
 * User Roles - Matching backend Role.java enum
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  OWNER: 'ADMIN', // Alias for backward compatibility
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  BRANCH_ADMIN: 'BRANCH_MANAGER', // Alias for backward compatibility
  PHARMACIST: 'PHARMACIST',
  CASHIER: 'CASHIER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.BRANCH_MANAGER]: 'Branch Manager',
  [ROLES.PHARMACIST]: 'Pharmacist',
  [ROLES.CASHIER]: 'Cashier',
  [ROLES.INVENTORY_MANAGER]: 'Inventory Manager',
  [ROLES.ACCOUNTANT]: 'Accountant',
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: '#9333ea', // purple-600
  [ROLES.ADMIN]: '#2563eb', // blue-600
  [ROLES.BRANCH_MANAGER]: '#16a34a', // green-600
  [ROLES.PHARMACIST]: '#0891b2', // cyan-600
  [ROLES.CASHIER]: '#ca8a04', // yellow-600
  [ROLES.INVENTORY_MANAGER]: '#ea580c', // orange-600
  [ROLES.ACCOUNTANT]: '#db2777', // pink-600
};

// Role hierarchy for authorization checks
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 7,
  [ROLES.ADMIN]: 6,
  [ROLES.BRANCH_MANAGER]: 5,
  [ROLES.ACCOUNTANT]: 4,
  [ROLES.INVENTORY_MANAGER]: 3,
  [ROLES.PHARMACIST]: 2,
  [ROLES.CASHIER]: 1,
};

export const getRoleLabel = (role) => ROLE_LABELS[role] || role;
export const getRoleColor = (role) => ROLE_COLORS[role] || '#6b7280';
