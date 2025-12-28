/**
 * Notification Store - Zustand store for notifications
 */
import { create } from 'zustand';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationStore = create((set, get) => ({
  ...initialState,

  // Set notifications
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },

  // Add notification
  addNotification: (notification) => {
    const { notifications } = get();
    set({
      notifications: [notification, ...notifications],
      unreadCount: get().unreadCount + (notification.read ? 0 : 1),
    });
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    const { notifications } = get();
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      set({
        notifications: notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    }
  },

  // Mark all as read
  markAllAsRead: () => {
    const { notifications } = get();
    set({
      notifications: notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
  },

  // Remove notification
  removeNotification: (notificationId) => {
    const { notifications } = get();
    const notification = notifications.find((n) => n.id === notificationId);
    set({
      notifications: notifications.filter((n) => n.id !== notificationId),
      unreadCount: notification && !notification.read
        ? Math.max(0, get().unreadCount - 1)
        : get().unreadCount,
    });
  },

  // Clear all notifications
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  // Set loading state
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // Set error
  setError: (error) => {
    set({ error, isLoading: false });
  },

  // Get unread notifications
  getUnreadNotifications: () => {
    const { notifications } = get();
    return notifications.filter((n) => !n.read);
  },

  // Reset store
  reset: () => {
    set(initialState);
  },
}));
