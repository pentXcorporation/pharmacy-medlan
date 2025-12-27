import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import styles from './DashboardLayout.module.css';

/**
 * DashboardLayout Component
 * Main layout for authenticated pages
 */
export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className={styles.main}>
        <Header onMenuToggle={toggleSidebar} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
