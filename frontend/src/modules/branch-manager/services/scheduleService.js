import { apiClient } from '@/lib/api';

/**
 * Schedule Management Service
 * Handles staff scheduling for branch managers
 */

const SCHEDULE_ENDPOINT = '/branch/schedule';

export const scheduleService = {
  /**
   * Get schedule (generic query with params)
   */
  getSchedule: (params = {}) => {
    return apiClient.get(SCHEDULE_ENDPOINT, { params });
  },

  /**
   * Get weekly schedule
   */
  getWeeklySchedule: (startDate) => {
    return apiClient.get(`${SCHEDULE_ENDPOINT}/weekly`, {
      params: { start_date: startDate },
    });
  },

  /**
   * Get schedule for specific date
   */
  getDailySchedule: (date) => {
    return apiClient.get(`${SCHEDULE_ENDPOINT}/daily`, {
      params: { date },
    });
  },

  /**
   * Create schedule entry
   */
  createSchedule: (data) => {
    return apiClient.post(SCHEDULE_ENDPOINT, data);
  },

  /**
   * Update schedule entry
   */
  updateSchedule: (id, data) => {
    return apiClient.put(`${SCHEDULE_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete schedule entry
   */
  deleteSchedule: (id) => {
    return apiClient.delete(`${SCHEDULE_ENDPOINT}/${id}`);
  },

  /**
   * Publish schedule (make visible to staff)
   */
  publishSchedule: (weekStartDate) => {
    return apiClient.post(`${SCHEDULE_ENDPOINT}/publish`, {
      week_start: weekStartDate,
    });
  },

  /**
   * Get available staff for scheduling
   */
  getAvailableStaff: (date, shiftType) => {
    return apiClient.get(`${SCHEDULE_ENDPOINT}/available-staff`, {
      params: { date, shift_type: shiftType },
    });
  },

  /**
   * Copy schedule from previous week
   */
  copyPreviousWeek: (targetWeekStart) => {
    return apiClient.post(`${SCHEDULE_ENDPOINT}/copy`, {
      target_week: targetWeekStart,
    });
  },

  /**
   * Get shift templates
   */
  getShiftTemplates: () => {
    return apiClient.get(`${SCHEDULE_ENDPOINT}/templates`);
  },

  /**
   * Create shift template
   */
  createShiftTemplate: (data) => {
    return apiClient.post(`${SCHEDULE_ENDPOINT}/templates`, data);
  },

  /**
   * Apply shift template
   */
  applyTemplate: (templateId, dates) => {
    return apiClient.post(`${SCHEDULE_ENDPOINT}/templates/${templateId}/apply`, {
      dates,
    });
  },

  /**
   * Get schedule conflicts (all current conflicts)
   */
  getScheduleConflicts: () => {
    return apiClient.get(`${SCHEDULE_ENDPOINT}/conflicts/all`);
  },

  /**
   * Check specific staff schedule conflicts
   */
  checkConflicts: (staffId, date, shiftType) => {
    return apiClient.get(`${SCHEDULE_ENDPOINT}/conflicts`, {
      params: { staff_id: staffId, date, shift_type: shiftType },
    });
  },
};
