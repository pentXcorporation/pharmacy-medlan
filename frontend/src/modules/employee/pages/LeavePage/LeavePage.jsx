import { useState } from 'react';
import { LeaveRequest } from '../../components';
import { useLeaveHistory } from '../../hooks';
import { LEAVE_TYPES, LEAVE_STATUS } from '../../constants';
import styles from './LeavePage.module.css';

const LeavePage = () => {
  const [activeTab, setActiveTab] = useState('request');
  const { data: historyData, isLoading } = useLeaveHistory();

  const leaveHistory = historyData?.data || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'pending':
        return styles.statusPending;
      case 'rejected':
        return styles.statusRejected;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leave Management</h1>
        <p className={styles.subtitle}>Apply for leave and track your requests</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'request' ? styles.active : ''}`}
          onClick={() => setActiveTab('request')}
        >
          Apply for Leave
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Leave History
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'request' && <LeaveRequest />}

        {activeTab === 'history' && (
          <div className={styles.historySection}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <span>Loading leave history...</span>
              </div>
            ) : leaveHistory.length === 0 ? (
              <div className={styles.empty}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>No leave requests found</span>
              </div>
            ) : (
              <div className={styles.leaveList}>
                {leaveHistory.map((leave) => (
                  <div key={leave.id} className={styles.leaveCard}>
                    <div className={styles.leaveHeader}>
                      <span className={styles.leaveType}>
                        {LEAVE_TYPES[leave.leave_type?.toUpperCase()]?.label || leave.leave_type}
                      </span>
                      <span className={`${styles.leaveStatus} ${getStatusClass(leave.status)}`}>
                        {LEAVE_STATUS[leave.status?.toUpperCase()]?.label || leave.status}
                      </span>
                    </div>

                    <div className={styles.leaveDates}>
                      <span className={styles.dateRange}>
                        {formatDate(leave.start_date)} — {formatDate(leave.end_date)}
                      </span>
                      <span className={styles.dayCount}>
                        {leave.days} day{leave.days !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {leave.reason && (
                      <p className={styles.leaveReason}>{leave.reason}</p>
                    )}

                    <div className={styles.leaveFooter}>
                      <span className={styles.appliedDate}>
                        Applied: {formatDate(leave.created_at)}
                      </span>
                      {leave.approved_by_name && (
                        <span className={styles.approvedBy}>
                          {leave.status === 'approved' ? 'Approved' : 'Reviewed'} by: {leave.approved_by_name}
                        </span>
                      )}
                    </div>

                    {leave.rejection_reason && (
                      <div className={styles.rejectionNote}>
                        <strong>Reason:</strong> {leave.rejection_reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavePage;
