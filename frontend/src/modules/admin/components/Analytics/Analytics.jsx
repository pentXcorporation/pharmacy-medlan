import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import styles from './Analytics.module.css';

/**
 * Analytics Component
 * System analytics and reporting dashboard
 */
export function Analytics() {
  // Sample data - in production, this would come from hooks/API
  const analyticsData = {
    userActivity: {
      daily: [120, 150, 180, 140, 200, 190, 170],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    systemMetrics: {
      uptime: '99.9%',
      responseTime: '145ms',
      errorRate: '0.1%',
      activeUsers: 24,
    },
    topActions: [
      { action: 'Login', count: 1250 },
      { action: 'Product View', count: 890 },
      { action: 'Sale Created', count: 456 },
      { action: 'Inventory Update', count: 234 },
      { action: 'Report Generated', count: 123 },
    ],
    usersByRole: [
      { role: 'Admin', count: 3 },
      { role: 'Branch Manager', count: 5 },
      { role: 'Pharmacist', count: 12 },
      { role: 'Cashier', count: 8 },
      { role: 'Employee', count: 15 },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Analytics</h1>
        <p className={styles.subtitle}>Overview of system performance and usage</p>
      </div>

      {/* System Metrics */}
      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <div className={styles.metricIcon}>⚡</div>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>System Uptime</p>
              <p className={styles.metricValue}>{analyticsData.systemMetrics.uptime}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <div className={styles.metricIcon}>🕐</div>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Avg Response Time</p>
              <p className={styles.metricValue}>{analyticsData.systemMetrics.responseTime}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <div className={styles.metricIcon}>⚠️</div>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Error Rate</p>
              <p className={styles.metricValue}>{analyticsData.systemMetrics.errorRate}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <div className={styles.metricIcon}>👥</div>
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Active Users</p>
              <p className={styles.metricValue}>{analyticsData.systemMetrics.activeUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* User Activity Chart */}
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Weekly User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.barChart}>
              {analyticsData.userActivity.daily.map((value, index) => (
                <div key={index} className={styles.barGroup}>
                  <div 
                    className={styles.bar}
                    style={{ height: `${(value / 200) * 100}%` }}
                  >
                    <span className={styles.barValue}>{value}</span>
                  </div>
                  <span className={styles.barLabel}>
                    {analyticsData.userActivity.labels[index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Actions */}
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Top Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.actionsList}>
              {analyticsData.topActions.map((item, index) => (
                <div key={index} className={styles.actionItem}>
                  <span className={styles.actionRank}>#{index + 1}</span>
                  <span className={styles.actionName}>{item.action}</span>
                  <div className={styles.actionBar}>
                    <div 
                      className={styles.actionProgress}
                      style={{ width: `${(item.count / 1250) * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.actionCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.rolesList}>
              {analyticsData.usersByRole.map((item, index) => (
                <div key={index} className={styles.roleItem}>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleName}>{item.role}</span>
                    <span className={styles.roleCount}>{item.count} users</span>
                  </div>
                  <div className={styles.roleBar}>
                    <div 
                      className={styles.roleProgress}
                      style={{ width: `${(item.count / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.quickStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Logins Today</span>
                <span className={styles.statValue}>145</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Failed Logins</span>
                <span className={styles.statValue}>3</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Password Resets</span>
                <span className={styles.statValue}>2</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>New Users (Week)</span>
                <span className={styles.statValue}>5</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Active Sessions</span>
                <span className={styles.statValue}>18</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>API Calls (Today)</span>
                <span className={styles.statValue}>12,456</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
