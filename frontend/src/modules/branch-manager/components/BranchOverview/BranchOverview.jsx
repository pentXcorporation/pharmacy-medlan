import { useTodayMetrics, useTopProducts, useSalesTrend, useInventoryAlerts } from '../../hooks';
import { BRANCH_METRICS, MANAGER_QUICK_ACTIONS } from '../../constants';
import { Link } from 'react-router-dom';
import styles from './BranchOverview.module.css';

const BranchOverview = () => {
  const { data: metricsData, isLoading: metricsLoading } = useTodayMetrics();
  const { data: topProductsData } = useTopProducts(5, 'week');
  const { data: alertsData } = useInventoryAlerts();

  const metrics = metricsData?.data || {};
  const topProducts = topProductsData?.data || [];
  const alerts = alertsData?.data || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const getMetricIcon = (iconName) => {
    const icons = {
      currency: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      receipt: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
      users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      warning: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      truck: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    };
    return icons[iconName] || icons.currency;
  };

  return (
    <div className={styles.branchOverview}>
      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        {Object.values(BRANCH_METRICS).map((metric) => (
          <div key={metric.key} className={styles.metricCard}>
            <div className={styles.metricIcon}>
              {getMetricIcon(metric.icon)}
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>
                {metricsLoading ? (
                  <span className={styles.skeleton} />
                ) : metric.key === 'today_sales' ? (
                  formatCurrency(metrics[metric.key])
                ) : (
                  metrics[metric.key] || 0
                )}
              </span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        {/* Quick Actions */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.quickActions}>
            {MANAGER_QUICK_ACTIONS.map((action) => (
              <Link
                key={action.key}
                to={action.path}
                className={styles.actionCard}
              >
                <span className={styles.actionLabel}>{action.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Top Selling Products (This Week)</h3>
          {topProducts.length === 0 ? (
            <div className={styles.empty}>No sales data available</div>
          ) : (
            <div className={styles.productList}>
              {topProducts.map((product, index) => (
                <div key={product.id} className={styles.productItem}>
                  <span className={styles.productRank}>{index + 1}</span>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productCategory}>{product.category}</span>
                  </div>
                  <div className={styles.productStats}>
                    <span className={styles.productQty}>{product.quantity_sold} units</span>
                    <span className={styles.productRevenue}>
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Alerts */}
        {alerts.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Inventory Alerts
              <span className={styles.alertBadge}>{alerts.length}</span>
            </h3>
            <div className={styles.alertList}>
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`${styles.alertItem} ${styles[alert.type]}`}
                >
                  <div className={styles.alertIcon}>
                    {alert.type === 'low_stock' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.alertContent}>
                    <span className={styles.alertMessage}>{alert.message}</span>
                    <span className={styles.alertProduct}>{alert.product_name}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/branch/inventory" className={styles.viewAllLink}>
              View All Alerts →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchOverview;
