import { AdminDashboard } from '../../components/AdminDashboard';
import styles from './AdminDashboardPage.module.css';

/**
 * AdminDashboardPage
 * Admin dashboard page component
 */
export function AdminDashboardPage() {
  return (
    <div className={styles.page}>
      <AdminDashboard />
    </div>
  );
}

export default AdminDashboardPage;
