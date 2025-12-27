// Employee Module Constants

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
  [TASK_STATUS.CANCELLED]: 'Cancelled',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.URGENT]: 'Urgent',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  ON_LEAVE: 'on_leave',
};

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.HALF_DAY]: 'Half Day',
  [ATTENDANCE_STATUS.ON_LEAVE]: 'On Leave',
};

export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  CASUAL: 'casual',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid',
};

export const LEAVE_TYPE_LABELS = {
  [LEAVE_TYPES.ANNUAL]: 'Annual Leave',
  [LEAVE_TYPES.SICK]: 'Sick Leave',
  [LEAVE_TYPES.CASUAL]: 'Casual Leave',
  [LEAVE_TYPES.MATERNITY]: 'Maternity Leave',
  [LEAVE_TYPES.PATERNITY]: 'Paternity Leave',
  [LEAVE_TYPES.UNPAID]: 'Unpaid Leave',
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const LEAVE_STATUS_LABELS = {
  [LEAVE_STATUS.PENDING]: 'Pending',
  [LEAVE_STATUS.APPROVED]: 'Approved',
  [LEAVE_STATUS.REJECTED]: 'Rejected',
  [LEAVE_STATUS.CANCELLED]: 'Cancelled',
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
  TASK: 'task',
  ANNOUNCEMENT: 'announcement',
};

export const QUICK_LINKS = [
  { id: 'tasks', label: 'My Tasks', icon: 'CheckSquare', path: '/employee/tasks' },
  { id: 'attendance', label: 'Attendance', icon: 'Clock', path: '/employee/attendance' },
  { id: 'leave', label: 'Leave Request', icon: 'Calendar', path: '/employee/leave' },
  { id: 'profile', label: 'My Profile', icon: 'User', path: '/employee/profile' },
];

export default {
  TASK_STATUS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY,
  TASK_PRIORITY_LABELS,
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
  LEAVE_TYPES,
  LEAVE_TYPE_LABELS,
  LEAVE_STATUS,
  LEAVE_STATUS_LABELS,
  NOTIFICATION_TYPES,
  QUICK_LINKS,
};
