import { ReportsView } from '../../components';
import styles from './ReportsPage.module.css';

const ReportsPage = () => {
  return (
    <div className={styles.reportsPage}>
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Branch Reports</h1>
          <p className={styles.subtitle}>Generate and view detailed branch performance reports</p>
        </div>
      </div>
      <ReportsView />
    </div>
  );
};

export default ReportsPage;
