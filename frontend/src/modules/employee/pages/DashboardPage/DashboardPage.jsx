import { EmployeeDashboard } from '../../components';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here's your overview for today.</p>
      </div>
      
      <EmployeeDashboard />
    </div>
  );
};

export default DashboardPage;
