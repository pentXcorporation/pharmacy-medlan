/**
 * Employee Module
 * 
 * This module provides employee self-service functionality including:
 * - Personal dashboard with quick stats
 * - Task management (view and update assigned tasks)
 * - Attendance tracking (check-in/out, history)
 * - Leave management (apply, balance, history)
 * - Profile management (personal info, notifications)
 * 
 * Access: All authenticated employees (EMPLOYEE, PHARMACIST, BRANCH_MANAGER)
 */

// Constants
export * from './constants';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Pages
export * from './pages';

// Routes
export { employeeRoutes, employeeNavItems } from './routes';
