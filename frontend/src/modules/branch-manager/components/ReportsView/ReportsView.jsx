import { useState, useMemo } from 'react';
import { useBranchReports, useExportReport } from '../../hooks';
import { REPORT_TYPES, BRANCH_METRICS } from '../../constants';
import styles from './ReportsView.module.css';

const ReportsView = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { data: reportData, isLoading, refetch } = useBranchReports(activeReport, dateRange);
  const exportReport = useExportReport();

  const report = reportData?.data || {};
  const reportTypes = Object.entries(REPORT_TYPES);

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    refetch();
  };

  const handleExportReport = (format) => {
    exportReport.mutate({
      type: activeReport,
      format,
      ...dateRange,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const renderSalesReport = () => {
    const { summary = {}, daily_sales = [], top_products = [] } = report;

    return (
      <div className={styles.reportContent}>
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Revenue</span>
            <span className={styles.summaryValue}>{formatCurrency(summary.total_revenue)}</span>
            {summary.revenue_growth && (
              <span className={`${styles.growth} ${summary.revenue_growth >= 0 ? styles.positive : styles.negative}`}>
                {summary.revenue_growth >= 0 ? '+' : ''}{summary.revenue_growth}%
              </span>
            )}
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Orders</span>
            <span className={styles.summaryValue}>{formatNumber(summary.total_orders)}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Average Order Value</span>
            <span className={styles.summaryValue}>{formatCurrency(summary.average_order_value)}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Items Sold</span>
            <span className={styles.summaryValue}>{formatNumber(summary.items_sold)}</span>
          </div>
        </div>

        <div className={styles.reportSections}>
          {/* Daily Sales */}
          <div className={styles.section}>
            <h4>Daily Sales Breakdown</h4>
            <div className={styles.chartPlaceholder}>
              <div className={styles.barChart}>
                {daily_sales.slice(0, 7).map((day, index) => (
                  <div key={index} className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{
                        height: `${(day.revenue / Math.max(...daily_sales.map(d => d.revenue), 1)) * 100}%`,
                      }}
                    />
                    <span className={styles.barLabel}>{day.date?.slice(-5)}</span>
                    <span className={styles.barValue}>{formatCurrency(day.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className={styles.section}>
            <h4>Top Selling Products</h4>
            <div className={styles.productList}>
              {top_products.map((product, index) => (
                <div key={index} className={styles.productItem}>
                  <span className={styles.rank}>{index + 1}</span>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productSku}>{product.sku}</span>
                  </div>
                  <div className={styles.productStats}>
                    <span className={styles.productQty}>{formatNumber(product.quantity)} units</span>
                    <span className={styles.productRevenue}>{formatCurrency(product.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInventoryReport = () => {
    const { summary = {}, categories = [], low_stock = [] } = report;

    return (
      <div className={styles.reportContent}>
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Products</span>
            <span className={styles.summaryValue}>{formatNumber(summary.total_products)}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Stock Value</span>
            <span className={styles.summaryValue}>{formatCurrency(summary.total_value)}</span>
          </div>
          <div className={`${styles.summaryCard} ${styles.warning}`}>
            <span className={styles.summaryLabel}>Low Stock Items</span>
            <span className={styles.summaryValue}>{formatNumber(summary.low_stock_count)}</span>
          </div>
          <div className={`${styles.summaryCard} ${styles.danger}`}>
            <span className={styles.summaryLabel}>Expiring Soon</span>
            <span className={styles.summaryValue}>{formatNumber(summary.expiring_soon)}</span>
          </div>
        </div>

        <div className={styles.reportSections}>
          {/* Category Distribution */}
          <div className={styles.section}>
            <h4>Stock by Category</h4>
            <div className={styles.categoryList}>
              {categories.map((category, index) => (
                <div key={index} className={styles.categoryItem}>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryProducts}>{category.products} products</span>
                  </div>
                  <div className={styles.categoryBar}>
                    <div
                      className={styles.categoryFill}
                      style={{
                        width: `${(category.value / Math.max(...categories.map(c => c.value), 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className={styles.categoryValue}>{formatCurrency(category.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className={styles.section}>
            <h4>Low Stock Alert</h4>
            <div className={styles.alertTable}>
              {low_stock.map((item, index) => (
                <div key={index} className={styles.alertRow}>
                  <span className={styles.alertProduct}>{item.name}</span>
                  <span className={styles.alertStock}>{item.current_stock}</span>
                  <span className={styles.alertReorder}>/ {item.reorder_level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStaffReport = () => {
    const { summary = {}, performance = [], attendance = {} } = report;

    return (
      <div className={styles.reportContent}>
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Staff</span>
            <span className={styles.summaryValue}>{formatNumber(summary.total_staff)}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Avg. Attendance Rate</span>
            <span className={styles.summaryValue}>{summary.avg_attendance || 0}%</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Active Leave</span>
            <span className={styles.summaryValue}>{formatNumber(summary.on_leave)}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Tasks Completed</span>
            <span className={styles.summaryValue}>{formatNumber(summary.tasks_completed)}</span>
          </div>
        </div>

        <div className={styles.reportSections}>
          {/* Staff Performance */}
          <div className={styles.section}>
            <h4>Staff Performance</h4>
            <div className={styles.performanceList}>
              {performance.map((staff, index) => (
                <div key={index} className={styles.performanceItem}>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffAvatar}>
                      {staff.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <span className={styles.staffName}>{staff.name}</span>
                      <span className={styles.staffRole}>{staff.role}</span>
                    </div>
                  </div>
                  <div className={styles.performanceStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{staff.sales || 0}</span>
                      <span className={styles.statLabel}>Sales</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{staff.tasks || 0}</span>
                      <span className={styles.statLabel}>Tasks</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{staff.attendance || 0}%</span>
                      <span className={styles.statLabel}>Attend.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className={styles.section}>
            <h4>Attendance Summary</h4>
            <div className={styles.attendanceGrid}>
              <div className={styles.attendanceCard}>
                <span className={styles.attendanceValue}>{attendance.present || 0}</span>
                <span className={styles.attendanceLabel}>Present Days</span>
              </div>
              <div className={styles.attendanceCard}>
                <span className={styles.attendanceValue}>{attendance.absent || 0}</span>
                <span className={styles.attendanceLabel}>Absent Days</span>
              </div>
              <div className={styles.attendanceCard}>
                <span className={styles.attendanceValue}>{attendance.late || 0}</span>
                <span className={styles.attendanceLabel}>Late Arrivals</span>
              </div>
              <div className={styles.attendanceCard}>
                <span className={styles.attendanceValue}>{attendance.leave || 0}</span>
                <span className={styles.attendanceLabel}>Leave Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Generating report...</span>
        </div>
      );
    }

    switch (activeReport) {
      case 'sales':
        return renderSalesReport();
      case 'inventory':
        return renderInventoryReport();
      case 'staff':
        return renderStaffReport();
      default:
        return (
          <div className={styles.empty}>
            <span>Select a report type to view</span>
          </div>
        );
    }
  };

  return (
    <div className={styles.reportsView}>
      {/* Report Type Selector */}
      <div className={styles.reportTypeGrid}>
        {reportTypes.map(([key, config]) => (
          <button
            key={key}
            className={`${styles.reportTypeCard} ${activeReport === key ? styles.active : ''}`}
            onClick={() => setActiveReport(key)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {config.icon === 'chart' && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18.75 8.25l-5.25 5.25-3-3-4.5 4.5" />
              )}
              {config.icon === 'boxes' && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              )}
              {config.icon === 'users' && (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              )}
            </svg>
            <span className={styles.reportTypeName}>{config.label}</span>
            <span className={styles.reportTypeDesc}>{config.description}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.dateFilters}>
          <div className={styles.dateField}>
            <label>From</label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
            />
          </div>
          <div className={styles.dateField}>
            <label>To</label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
            />
          </div>
          <button onClick={handleGenerateReport} className={styles.generateBtn}>
            Generate Report
          </button>
        </div>

        <div className={styles.exportActions}>
          <button onClick={() => handleExportReport('pdf')} className={styles.exportBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
          <button onClick={() => handleExportReport('excel')} className={styles.exportBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Excel
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className={styles.reportContainer}>
        {renderReportContent()}
      </div>
    </div>
  );
};

export default ReportsView;
