import { StaffManagement } from '../../components';
import styles from './StaffPage.module.css';

const StaffPage = () => {
  return (
    <div className={styles.staffPage}>
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Staff Management</h1>
          <p className={styles.subtitle}>Manage your branch staff, attendance, and leave requests</p>
        </div>
      </div>
      <StaffManagement />
    </div>
  );
};

export default StaffPage;
