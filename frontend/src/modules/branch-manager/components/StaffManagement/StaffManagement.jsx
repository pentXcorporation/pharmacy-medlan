import { useState } from 'react';
import { useStaffList, useUpdateStaffStatus, usePendingLeaveRequests, useApproveLeave, useRejectLeave } from '../../hooks';
import { STAFF_STATUS, STAFF_TABLE_COLUMNS } from '../../constants';
import styles from './StaffManagement.module.css';

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rejectModal, setRejectModal] = useState({ show: false, leaveId: null });
  const [rejectReason, setRejectReason] = useState('');

  const { data: staffData, isLoading: staffLoading } = useStaffList({
    search: searchQuery,
    status: statusFilter || undefined,
  });
  const { data: leaveData, isLoading: leaveLoading } = usePendingLeaveRequests();

  const updateStatus = useUpdateStaffStatus();
  const approveLeave = useApproveLeave();
  const rejectLeave = useRejectLeave();

  const staffList = staffData?.data || [];
  const pendingLeave = leaveData?.data || [];

  const handleStatusChange = (staffId, newStatus) => {
    updateStatus.mutate({ id: staffId, status: newStatus });
  };

  const handleApproveLeave = (leaveId) => {
    approveLeave.mutate({ id: leaveId, comment: '' });
  };

  const handleRejectLeave = () => {
    if (rejectModal.leaveId && rejectReason) {
      rejectLeave.mutate(
        { id: rejectModal.leaveId, reason: rejectReason },
        {
          onSuccess: () => {
            setRejectModal({ show: false, leaveId: null });
            setRejectReason('');
          },
        }
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'on_leave':
        return styles.statusOnLeave;
      case 'terminated':
        return styles.statusTerminated;
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.staffManagement}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Staff List
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'leave' ? styles.active : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          Leave Requests
          {pendingLeave.length > 0 && (
            <span className={styles.badge}>{pendingLeave.length}</span>
          )}
        </button>
      </div>

      {/* Staff List Tab */}
      {activeTab === 'list' && (
        <div className={styles.listSection}>
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              {Object.entries(STAFF_STATUS).map(([key, status]) => (
                <option key={key} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {staffLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Loading staff...</span>
            </div>
          ) : staffList.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>No staff members found</span>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff.id}>
                      <td>
                        <div className={styles.staffName}>
                          <div className={styles.avatar}>
                            {staff.name?.charAt(0) || 'S'}
                          </div>
                          <span>{staff.name}</span>
                        </div>
                      </td>
                      <td>{staff.role}</td>
                      <td>{staff.email}</td>
                      <td>{staff.phone || '-'}</td>
                      <td>
                        <span className={`${styles.status} ${getStatusClass(staff.status)}`}>
                          {STAFF_STATUS[staff.status?.toUpperCase()]?.label || staff.status}
                        </span>
                      </td>
                      <td>{formatDate(staff.join_date)}</td>
                      <td>
                        <div className={styles.actions}>
                          <select
                            value={staff.status}
                            onChange={(e) => handleStatusChange(staff.id, e.target.value)}
                            className={styles.statusSelect}
                            disabled={updateStatus.isPending}
                          >
                            {Object.entries(STAFF_STATUS).map(([key, status]) => (
                              <option key={key} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Leave Requests Tab */}
      {activeTab === 'leave' && (
        <div className={styles.leaveSection}>
          {leaveLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Loading leave requests...</span>
            </div>
          ) : pendingLeave.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No pending leave requests</span>
            </div>
          ) : (
            <div className={styles.leaveList}>
              {pendingLeave.map((leave) => (
                <div key={leave.id} className={styles.leaveCard}>
                  <div className={styles.leaveHeader}>
                    <div className={styles.employeeInfo}>
                      <div className={styles.avatar}>
                        {leave.employee_name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <span className={styles.employeeName}>{leave.employee_name}</span>
                        <span className={styles.employeeRole}>{leave.employee_role}</span>
                      </div>
                    </div>
                    <span className={styles.leaveType}>{leave.leave_type}</span>
                  </div>

                  <div className={styles.leaveDates}>
                    <span>{formatDate(leave.start_date)}</span>
                    <span>→</span>
                    <span>{formatDate(leave.end_date)}</span>
                    <span className={styles.leaveDays}>{leave.days} days</span>
                  </div>

                  {leave.reason && (
                    <p className={styles.leaveReason}>{leave.reason}</p>
                  )}

                  <div className={styles.leaveActions}>
                    <button
                      onClick={() => handleApproveLeave(leave.id)}
                      className={styles.approveBtn}
                      disabled={approveLeave.isPending}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectModal({ show: true, leaveId: leave.id })}
                      className={styles.rejectBtn}
                      disabled={rejectLeave.isPending}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className={styles.modalOverlay} onClick={() => setRejectModal({ show: false, leaveId: null })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Reject Leave Request</h3>
            <p>Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setRejectModal({ show: false, leaveId: null })}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectLeave}
                className={styles.confirmRejectBtn}
                disabled={!rejectReason || rejectLeave.isPending}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
