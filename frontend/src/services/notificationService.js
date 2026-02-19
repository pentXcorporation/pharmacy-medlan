/**
 * Notification Service
 * Handles all notification-related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const notificationService = {
  /**
   * Get user notifications
   */
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params });
  },

  /**
   * Get unread notifications
   */
  getUnread: () => {
    return api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD);
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: () => {
    return api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },

  /**
   * Send notification
   */
  send: (data) => {
    return api.post(API_ENDPOINTS.NOTIFICATIONS.BASE, data);
  },

  /**
   * Send bulk notifications
   */
  sendBulk: (data) => {
    return api.post(API_ENDPOINTS.NOTIFICATIONS.SEND_BULK, data);
  },

  /**
   * Send notification to branch
   */
  sendToBranch: (branchId, data) => {
    return api.post(API_ENDPOINTS.NOTIFICATIONS.SEND_TO_BRANCH(branchId), data);
  },

  /**
   * Send notification to role
   */
  sendToRole: (data) => {
    return api.post(API_ENDPOINTS.NOTIFICATIONS.SEND_TO_ROLE, data);
  },

  /**
   * Mark notification as read
   */
  markAsRead: (id) => {
    return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  /**
   * Delete notification
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
  },

  /**
   * Delete all notifications
   */
  deleteAll: () => {
    return api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
  },
};

export default notificationService;
