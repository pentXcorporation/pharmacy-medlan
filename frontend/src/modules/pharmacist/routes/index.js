// Pharmacist Routes
import { lazy } from 'react';

// Lazy load pages
const POSPage = lazy(() => import('../pages/POSPage'));
const PrescriptionsPage = lazy(() => import('../pages/PrescriptionsPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));

export const pharmacistRoutes = [
  {
    path: 'pos',
    element: POSPage,
    meta: {
      title: 'Point of Sale',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'CASHIER'],
    },
  },
  {
    path: 'prescriptions',
    element: PrescriptionsPage,
    meta: {
      title: 'Prescriptions',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST'],
    },
  },
  {
    path: 'inventory',
    element: InventoryPage,
    meta: {
      title: 'Inventory',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'],
    },
  },
];

export default pharmacistRoutes;
