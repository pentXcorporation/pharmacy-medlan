// Prescription List Component
import { useState, useCallback, useMemo } from 'react';
import { usePrescriptions, useUpdatePrescriptionStatus } from '../../hooks';
import { PRESCRIPTION_STATUS, PRESCRIPTION_STATUS_LABELS, PRESCRIPTION_STATUS_COLORS } from '../../constants';
import styles from './PrescriptionList.module.css';

const PrescriptionList = ({ onSelectPrescription }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = usePrescriptions({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    page: currentPage,
    limit: pageSize,
  });

  const updateStatus = useUpdatePrescriptionStatus();

  const prescriptions = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery) return prescriptions;
    
    const query = searchQuery.toLowerCase();
    return prescriptions.filter(
      (rx) =>
        rx.prescriptionNo?.toLowerCase().includes(query) ||
        rx.patientName?.toLowerCase().includes(query) ||
        rx.doctor?.toLowerCase().includes(query)
    );
  }, [prescriptions, searchQuery]);

  const handleStatusChange = useCallback(async (prescriptionId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ prescriptionId, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, [updateStatus]);

  const getStatusBadgeClass = (status) => {
    const colorMap = {
      [PRESCRIPTION_STATUS.PENDING]: styles.badgeWarning,
      [PRESCRIPTION_STATUS.PROCESSING]: styles.badgeInfo,
      [PRESCRIPTION_STATUS.READY]: styles.badgeSuccess,
      [PRESCRIPTION_STATUS.DISPENSED]: styles.badgeDefault,
      [PRESCRIPTION_STATUS.CANCELLED]: styles.badgeError,
      [PRESCRIPTION_STATUS.ON_HOLD]: styles.badgeSecondary,
    };
    return colorMap[status] || styles.badgeDefault;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.prescriptionList}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Prescriptions</h2>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        {Object.entries(PRESCRIPTION_STATUS).map(([key, value]) => (
          <button
            key={key}
            className={`${styles.filterBtn} ${filterStatus === value ? styles.active : ''}`}
            onClick={() => setFilterStatus(value)}
          >
            {PRESCRIPTION_STATUS_LABELS[value]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Loading prescriptions...</span>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>Failed to load prescriptions</p>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeWidth="2" />
              <rect x="9" y="3" width="6" height="4" rx="1" strokeWidth="2" />
            </svg>
            <p>No prescriptions found</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rx No.</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td className={styles.rxNo}>{prescription.prescriptionNo}</td>
                  <td>
                    <div className={styles.patientCell}>
                      <span className={styles.patientName}>{prescription.patientName}</span>
                      {prescription.patientPhone && (
                        <span className={styles.patientPhone}>{prescription.patientPhone}</span>
                      )}
                    </div>
                  </td>
                  <td>{prescription.doctor}</td>
                  <td>{formatDate(prescription.createdAt)}</td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(prescription.status)}`}>
                      {PRESCRIPTION_STATUS_LABELS[prescription.status]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onSelectPrescription?.(prescription)}
                        title="View Details"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3" strokeWidth="2" />
                        </svg>
                      </button>
                      
                      {prescription.status === PRESCRIPTION_STATUS.PENDING && (
                        <button
                          className={`${styles.actionBtn} ${styles.processBtn}`}
                          onClick={() => handleStatusChange(prescription.id, PRESCRIPTION_STATUS.PROCESSING)}
                          title="Start Processing"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" strokeWidth="2" />
                          </svg>
                        </button>
                      )}
                      
                      {prescription.status === PRESCRIPTION_STATUS.PROCESSING && (
                        <button
                          className={`${styles.actionBtn} ${styles.readyBtn}`}
                          onClick={() => handleStatusChange(prescription.id, PRESCRIPTION_STATUS.READY)}
                          title="Mark as Ready"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 6 9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      
                      {prescription.status === PRESCRIPTION_STATUS.READY && (
                        <button
                          className={`${styles.actionBtn} ${styles.dispenseBtn}`}
                          onClick={() => handleStatusChange(prescription.id, PRESCRIPTION_STATUS.DISPENSED)}
                          title="Dispense"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                            <path d="M3 9h18M9 21V9" strokeWidth="2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
