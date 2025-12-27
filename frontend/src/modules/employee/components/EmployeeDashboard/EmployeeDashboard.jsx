// Employee Dashboard Component
import { useTaskStats, useMyTasks } from '../../hooks';
import { useTodayAttendance, useAttendanceStats } from '../../hooks';
import { useLeaveBalance } from '../../hooks';
import { useNotifications } from '../../hooks';
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_PRIORITY } from '../../constants';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const { data: taskStats } = useTaskStats();
  const { data: tasksData } = useMyTasks({ status: TASK_STATUS.PENDING, limit: 5 });
  const { data: attendanceData } = useTodayAttendance();
  const { data: attendanceStats } = useAttendanceStats();
  const { data: leaveBalance } = useLeaveBalance();
  const { data: notificationsData } = useNotifications({ limit: 5 });

  const stats = taskStats?.data || {};
  const pendingTasks = tasksData?.data || [];
  const todayAttendance = attendanceData?.data || {};
  const monthlyStats = attendanceStats?.data || {};
  const balance = leaveBalance?.data || {};
  const notifications = notificationsData?.data || [];

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPriorityClass = (priority) => {
    const classes = {
      [TASK_PRIORITY.LOW]: styles.priorityLow,
      [TASK_PRIORITY.MEDIUM]: styles.priorityMedium,
      [TASK_PRIORITY.HIGH]: styles.priorityHigh,
      [TASK_PRIORITY.URGENT]: styles.priorityUrgent,
    };
    return classes[priority] || styles.priorityMedium;
  };

  return (
    <div className={styles.dashboard}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Good Morning! 👋</h1>
          <p className={styles.welcomeText}>
            Here's your overview for today. Have a productive day!
          </p>
        </div>
        <div className={styles.currentTime}>
          <span className={styles.timeLabel}>Current Time</span>
          <span className={styles.timeValue}>{currentTime}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11l3 3L22 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeWidth="2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.pending || 0}</span>
            <span className={styles.statLabel}>Pending Tasks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{monthlyStats.presentDays || 0}</span>
            <span className={styles.statLabel}>Present Days (Month)</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{balance.annual || 0}</span>
            <span className={styles.statLabel}>Leave Balance</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
              <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.completedThisMonth || 0}</span>
            <span className={styles.statLabel}>Tasks Completed</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Attendance Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Today's Attendance</h3>
          </div>
          <div className={styles.attendanceContent}>
            {todayAttendance.checkInTime ? (
              <>
                <div className={styles.attendanceRow}>
                  <span className={styles.attendanceLabel}>Check In</span>
                  <span className={styles.attendanceValue}>
                    {new Date(todayAttendance.checkInTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {todayAttendance.checkOutTime ? (
                  <div className={styles.attendanceRow}>
                    <span className={styles.attendanceLabel}>Check Out</span>
                    <span className={styles.attendanceValue}>
                      {new Date(todayAttendance.checkOutTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ) : (
                  <div className={styles.attendanceRow}>
                    <span className={styles.attendanceLabel}>Status</span>
                    <span className={`${styles.attendanceValue} ${styles.working}`}>Working</span>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noAttendance}>
                <p>You haven't checked in today</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Pending Tasks</h3>
            <a href="/employee/tasks" className={styles.viewAll}>View All</a>
          </div>
          <div className={styles.taskList}>
            {pendingTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No pending tasks</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={`${styles.taskPriority} ${getPriorityClass(task.priority)}`}></div>
                  <div className={styles.taskContent}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={styles.taskDue}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Notifications</h3>
            <a href="/employee/notifications" className={styles.viewAll}>View All</a>
          </div>
          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                >
                  <div className={styles.notificationIcon}>
                    {notification.type === 'task' ? '📋' : '🔔'}
                  </div>
                  <div className={styles.notificationContent}>
                    <span className={styles.notificationTitle}>{notification.title}</span>
                    <span className={styles.notificationTime}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
