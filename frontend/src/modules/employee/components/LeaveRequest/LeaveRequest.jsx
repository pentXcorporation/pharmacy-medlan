import { useState } from 'react';
import { useApplyLeave, useLeaveBalance, useHolidays } from '../../hooks';
import { LEAVE_TYPES, LEAVE_STATUS } from '../../constants';
import styles from './LeaveRequest.module.css';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [showForm, setShowForm] = useState(false);

  const { data: balanceData } = useLeaveBalance();
  const { data: holidaysData } = useHolidays(new Date().getFullYear());
  const applyLeave = useApplyLeave();

  const balance = balanceData?.data || {};
  const holidays = holidaysData?.data || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyLeave.mutate(formData, {
      onSuccess: () => {
        setFormData({
          leave_type: '',
          start_date: '',
          end_date: '',
          reason: '',
        });
        setShowForm(false);
      },
    });
  };

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.leaveRequest}>
      {/* Leave Balance */}
      <div className={styles.balanceSection}>
        <h3 className={styles.sectionTitle}>Leave Balance</h3>
        <div className={styles.balanceGrid}>
          {Object.entries(LEAVE_TYPES).map(([key, type]) => {
            const available = balance[type.value] || 0;
            const total = type.maxDays || 0;
            const percentage = total > 0 ? (available / total) * 100 : 0;
            
            return (
              <div key={key} className={styles.balanceCard}>
                <div className={styles.balanceHeader}>
                  <span className={styles.balanceLabel}>{type.label}</span>
                  <span className={styles.balanceCount}>
                    {available} / {total}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionSection}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className={styles.applyBtn}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Apply for Leave
          </button>
        ) : (
          <form onSubmit={handleSubmit} className={styles.leaveForm}>
            <div className={styles.formHeader}>
              <h4>New Leave Request</h4>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.closeBtn}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="leave_type">Leave Type *</label>
                <select
                  id="leave_type"
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  {Object.entries(LEAVE_TYPES).map(([key, type]) => (
                    <option key={key} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="start_date">Start Date *</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  min={today}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="end_date">End Date *</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  min={formData.start_date || today}
                  required
                />
              </div>

              <div className={styles.formGroupFull}>
                <label htmlFor="reason">Reason *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>
            </div>

            {calculateDays() > 0 && (
              <div className={styles.summary}>
                <span>Total Days: {calculateDays()}</span>
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={applyLeave.isPending}
              >
                {applyLeave.isPending ? (
                  <>
                    <span className={styles.btnSpinner} />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Upcoming Holidays */}
      {holidays.length > 0 && (
        <div className={styles.holidaysSection}>
          <h3 className={styles.sectionTitle}>Upcoming Holidays</h3>
          <ul className={styles.holidayList}>
            {holidays.slice(0, 5).map((holiday) => (
              <li key={holiday.id} className={styles.holidayItem}>
                <div className={styles.holidayDate}>
                  <span className={styles.holidayDay}>
                    {new Date(holiday.date).getDate()}
                  </span>
                  <span className={styles.holidayMonth}>
                    {new Date(holiday.date).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </span>
                </div>
                <div className={styles.holidayInfo}>
                  <span className={styles.holidayName}>{holiday.name}</span>
                  <span className={styles.holidayWeekday}>
                    {formatDate(holiday.date)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
