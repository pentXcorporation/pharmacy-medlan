import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

/**
 * AuthLayout Component
 * Layout for authentication pages (login, register, etc.)
 */
export function AuthLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💊</span>
            <span className={styles.logoText}>MedLan Pharmacy</span>
          </div>
          <p className={styles.tagline}>Professional Pharmacy Management System</p>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <div className={styles.background}>
        <div className={styles.backgroundContent}>
          <h2>Welcome to MedLan</h2>
          <p>Streamline your pharmacy operations with our comprehensive management solution.</p>
          <ul className={styles.features}>
            <li>📦 Inventory Management</li>
            <li>💰 Point of Sale</li>
            <li>📊 Reports & Analytics</li>
            <li>👥 Customer Management</li>
            <li>🏢 Multi-Branch Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
