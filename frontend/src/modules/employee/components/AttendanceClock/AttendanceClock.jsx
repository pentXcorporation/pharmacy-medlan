// Attendance Clock Component
import { useState, useEffect } from 'react';
import { useTodayAttendance, useCheckIn, useCheckOut } from '../../hooks';
import styles from './AttendanceClock.module.css';

const AttendanceClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { data, isLoading } = useTodayAttendance();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const todayAttendance = data?.data || {};
  const isCheckedIn = !!todayAttendance.checkInTime;
  const isCheckedOut = !!todayAttendance.checkOutTime;

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      await checkIn.mutateAsync({
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut.mutateAsync({
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Check-out error:', error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateWorkingHours = () => {
    if (!todayAttendance.checkInTime) return '0h 0m';
    
    const checkInTime = new Date(todayAttendance.checkInTime);
    const endTime = todayAttendance.checkOutTime 
      ? new Date(todayAttendance.checkOutTime) 
      : currentTime;
    
    const diff = endTime - checkInTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={styles.attendanceClock}>
      {/* Clock Display */}
      <div className={styles.clockSection}>
        <div className={styles.timeDisplay}>
          {formatTime(currentTime)}
        </div>
        <div className={styles.dateDisplay}>
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Status Section */}
      <div className={styles.statusSection}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Loading attendance...</span>
          </div>
        ) : (
          <>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Check In</span>
                <span className={styles.statusValue}>
                  {todayAttendance.checkInTime
                    ? new Date(todayAttendance.checkInTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--:--'}
                </span>
              </div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Check Out</span>
                <span className={styles.statusValue}>
                  {todayAttendance.checkOutTime
                    ? new Date(todayAttendance.checkOutTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--:--'}
                </span>
              </div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Working Hours</span>
                <span className={styles.statusValue}>
                  {calculateWorkingHours()}
                </span>
              </div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Status</span>
                <span className={`${styles.statusValue} ${
                  isCheckedOut ? styles.completed : 
                  isCheckedIn ? styles.working : 
                  styles.notStarted
                }`}>
                  {isCheckedOut ? 'Completed' : isCheckedIn ? 'Working' : 'Not Started'}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className={styles.actionSection}>
              {!isCheckedIn ? (
                <button
                  className={`${styles.clockBtn} ${styles.checkIn}`}
                  onClick={handleCheckIn}
                  disabled={checkIn.isPending}
                >
                  {checkIn.isPending ? (
                    <>
                      <div className={styles.btnSpinner}></div>
                      Checking In...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeWidth="2" />
                        <polyline points="10 17 15 12 10 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="15" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Check In
                    </>
                  )}
                </button>
              ) : !isCheckedOut ? (
                <button
                  className={`${styles.clockBtn} ${styles.checkOut}`}
                  onClick={handleCheckOut}
                  disabled={checkOut.isPending}
                >
                  {checkOut.isPending ? (
                    <>
                      <div className={styles.btnSpinner}></div>
                      Checking Out...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" />
                        <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Check Out
                    </>
                  )}
                </button>
              ) : (
                <div className={styles.completedMessage}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
                    <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>You've completed your attendance for today</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceClock;
