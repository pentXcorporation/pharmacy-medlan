import { lazy } from 'react';

// Lazy-loaded pages for code splitting
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const TasksPage = lazy(() => import('../pages/TasksPage'));
const AttendancePage = lazy(() => import('../pages/AttendancePage'));
const LeavePage = lazy(() => import('../pages/LeavePage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

/**
 * Employee Module Routes Configuration
 * Role: EMPLOYEE, PHARMACIST, BRANCH_MANAGER (all employees)
 */
export const employeeRoutes = [
  {
    path: 'employee',
    children: [
      {
        index: true,
        element: DashboardPage,
      },
      {
        path: 'dashboard',
        element: DashboardPage,
        meta: {
          title: 'My Dashboard',
          description: 'Personal employee dashboard',
        },
      },
      {
        path: 'tasks',
        element: TasksPage,
        meta: {
          title: 'My Tasks',
          description: 'View and manage assigned tasks',
        },
      },
      {
        path: 'attendance',
        element: AttendancePage,
        meta: {
          title: 'Attendance',
          description: 'Track attendance and work hours',
        },
      },
      {
        path: 'leave',
        element: LeavePage,
        meta: {
          title: 'Leave Management',
          description: 'Apply for leave and track requests',
        },
      },
      {
        path: 'profile',
        element: ProfilePage,
        meta: {
          title: 'My Profile',
          description: 'View and update personal information',
        },
      },
    ],
  },
];

// Sidebar navigation items for employees
export const employeeNavItems = [
  {
    key: 'employee-dashboard',
    label: 'My Dashboard',
    path: '/employee/dashboard',
    icon: 'dashboard',
  },
  {
    key: 'employee-tasks',
    label: 'My Tasks',
    path: '/employee/tasks',
    icon: 'tasks',
  },
  {
    key: 'employee-attendance',
    label: 'Attendance',
    path: '/employee/attendance',
    icon: 'clock',
  },
  {
    key: 'employee-leave',
    label: 'Leave',
    path: '/employee/leave',
    icon: 'calendar',
  },
  {
    key: 'employee-profile',
    label: 'My Profile',
    path: '/employee/profile',
    icon: 'user',
  },
];

export default employeeRoutes;
