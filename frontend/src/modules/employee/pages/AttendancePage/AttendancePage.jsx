import { useState } from 'react';
import { AttendanceClock } from '../../components';
import { useAttendanceHistory } from '../../hooks';
import { ATTENDANCE_STATUS } from '../../constants';
import styles from './AttendancePage.module.css';

const AttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [year, month] = selectedMonth.split('-');
  const { data: historyData, isLoading } = useAttendanceHistory(
    parseInt(year),
    parseInt(month)
  );

  const history = historyData?.data || [];

  const formatTime = (time) => {
    if (!time) return '-';
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'present':
        return styles.statusPresent;
      case 'late':
        return styles.statusLate;
      case 'absent':
        return styles.statusAbsent;
      case 'half_day':
        return styles.statusHalfDay;
      case 'on_leave':
        return styles.statusOnLeave;
      default:
        return '';
    }
  };

  // Calculate summary
  const summary = history.reduce(
    (acc, record) => {
      if (record.status === 'present') acc.present++;
      else if (record.status === 'late') acc.late++;
      else if (record.status === 'absent') acc.absent++;
      else if (record.status === 'on_leave') acc.onLeave++;
      return acc;
    },
    { present: 0, late: 0, absent: 0, onLeave: 0 }
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attendance</h1>
        <p className={styles.subtitle}>Track your daily attendance and work hours</p>
      </div>

      <div className={styles.content}>
        <div className={styles.clockSection}>
          <AttendanceClock />
        </div>

        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h2 className={styles.sectionTitle}>Attendance History</h2>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.monthPicker}
            />
          </div>

          {/* Summary Cards */}
          <div className={styles.summaryGrid}>
            <div className={`${styles.summaryCard} ${styles.present}`}>
              <span className={styles.summaryValue}>{summary.present}</span>
              <span className={styles.summaryLabel}>Present</span>
            </div>
            <div className={`${styles.summaryCard} ${styles.late}`}>
              <span className={styles.summaryValue}>{summary.late}</span>
              <span className={styles.summaryLabel}>Late</span>
            </div>
            <div className={`${styles.summaryCard} ${styles.absent}`}>
              <span className={styles.summaryValue}>{summary.absent}</span>
              <span className={styles.summaryLabel}>Absent</span>
            </div>
            <div className={`${styles.summaryCard} ${styles.leave}`}>
              <span className={styles.summaryValue}>{summary.onLeave}</span>
              <span className={styles.summaryLabel}>On Leave</span>
            </div>
          </div>

          {/* History Table */}
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Loading attendance history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>No attendance records found</span>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Working Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td>{formatDate(record.date)}</td>
                      <td>{formatTime(record.check_in)}</td>
                      <td>{formatTime(record.check_out)}</td>
                      <td>{record.working_hours ? `${record.working_hours}h` : '-'}</td>
                      <td>
                        <span className={`${styles.status} ${getStatusClass(record.status)}`}>
                          {ATTENDANCE_STATUS[record.status?.toUpperCase()]?.label || record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
