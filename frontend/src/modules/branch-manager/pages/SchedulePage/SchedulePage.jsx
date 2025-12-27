import { ScheduleManager } from '../../components';
import styles from './SchedulePage.module.css';

const SchedulePage = () => {
  return (
    <div className={styles.schedulePage}>
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Staff Scheduling</h1>
          <p className={styles.subtitle}>Plan and manage staff shifts and work schedules</p>
        </div>
      </div>
      <ScheduleManager />
    </div>
  );
};

export default SchedulePage;
