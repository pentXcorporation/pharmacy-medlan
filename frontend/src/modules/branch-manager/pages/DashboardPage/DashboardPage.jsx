import { BranchOverview } from '../../components';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Branch Dashboard</h1>
          <p className={styles.subtitle}>Monitor your branch performance and operations</p>
        </div>
      </div>
      <BranchOverview />
    </div>
  );
};

export default DashboardPage;
