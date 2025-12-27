import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useUsers } from '../../hooks/useUsers';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import styles from './AdminDashboard.module.css';

/**
 * AdminDashboard Component
 * Main dashboard for system administrators
 */
export function AdminDashboard() {
  const { users, totalUsers, isLoading: usersLoading } = useUsers();
  const { logs, statistics, isLoading: logsLoading } = useAuditLogs({ limit: 5 });

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: '👥',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Users',
      value: users?.filter(u => u.status === 'ACTIVE').length || 0,
      icon: '✅',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Total Branches',
      value: '5',
      icon: '🏢',
      change: '0%',
      changeType: 'neutral',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      icon: '⚡',
      change: '+0.1%',
      changeType: 'positive',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} className={styles.statCard}>
            <CardContent className={styles.statContent}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statInfo}>
                <p className={styles.statTitle}>{stat.title}</p>
                <p className={styles.statValue}>{stat.value}</p>
                <span className={`${styles.statChange} ${styles[stat.changeType]}`}>
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Recent Users */}
        <Card className={styles.recentCard}>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p>Loading...</p>
            ) : (
              <div className={styles.usersList}>
                {users?.slice(0, 5).map((user) => (
                  <div key={user.id} className={styles.userItem}>
                    <div className={styles.userAvatar}>
                      {user.fullName?.[0] || user.username?.[0] || '?'}
                    </div>
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{user.fullName || user.username}</p>
                      <p className={styles.userRole}>{user.role}</p>
                    </div>
                    <span className={`${styles.userStatus} ${styles[user.status?.toLowerCase()]}`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className={styles.activityCard}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <p>Loading...</p>
            ) : (
              <div className={styles.activityList}>
                {logs?.slice(0, 5).map((log, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityDot}></div>
                    <div className={styles.activityInfo}>
                      <p className={styles.activityText}>
                        <strong>{log.username}</strong> {log.action}
                      </p>
                      <p className={styles.activityTime}>
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
