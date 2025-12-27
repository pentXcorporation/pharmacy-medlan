import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ROLES } from '@/modules/auth/constants';
import styles from './Sidebar.module.css';

/**
 * Sidebar Component
 * Main navigation sidebar
 */
export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.EMPLOYEE],
    },
    {
      title: 'POS',
      icon: '🛒',
      path: '/pos',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.CASHIER],
    },
    {
      title: 'Inventory',
      icon: '📦',
      children: [
        { title: 'Products', path: '/inventory/products' },
        { title: 'Categories', path: '/inventory/categories' },
        { title: 'Stock Transfer', path: '/inventory/stock-transfer' },
        { title: 'Stock Adjustment', path: '/inventory/adjustment' },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.INVENTORY_MANAGER],
    },
    {
      title: 'Sales',
      icon: '💰',
      children: [
        { title: 'All Sales', path: '/sales' },
        { title: 'Sale Returns', path: '/sales/returns' },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.CASHIER],
    },
    {
      title: 'Purchases',
      icon: '🛍️',
      children: [
        { title: 'Purchase Orders', path: '/purchases/orders' },
        { title: 'GRN', path: '/purchases/grn' },
        { title: 'Suppliers', path: '/purchases/suppliers' },
      ],
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST],
    },
    {
      title: 'Customers',
      icon: '👥',
      path: '/customers',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER, ROLES.PHARMACIST, ROLES.CASHIER],
    },
    {
      title: 'Reports',
      icon: '📈',
      path: '/reports',
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.BRANCH_MANAGER],
    },
    {
      title: 'Administration',
      icon: '⚙️',
      children: [
        { title: 'Dashboard', path: '/admin/dashboard' },
        { title: 'Users', path: '/admin/users' },
        { title: 'Roles', path: '/admin/roles' },
        { title: 'Branches', path: '/admin/branches' },
        { title: 'Settings', path: '/admin/settings' },
        { title: 'Audit Logs', path: '/admin/audit-logs' },
      ],
      roles: [ROLES.ADMIN],
    },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}></div>
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/dashboard" className={styles.logoLink}>
            <span className={styles.logoIcon}>💊</span>
            <span className={styles.logoText}>MedLan</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {filteredNavItems.map((item, index) => (
            <div key={index} className={styles.navItem}>
              {item.children ? (
                <>
                  <button
                    className={`${styles.navButton} ${
                      item.children.some(child => isActive(child.path)) ? styles.active : ''
                    }`}
                    onClick={() => toggleMenu(item.title)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navText}>{item.title}</span>
                    <span className={`${styles.chevron} ${expandedMenus[item.title] ? styles.expanded : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedMenus[item.title] && (
                    <div className={styles.subMenu}>
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.path}
                          className={`${styles.subNavLink} ${isActive(child.path) ? styles.active : ''}`}
                          onClick={onClose}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
                  onClick={onClose}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navText}>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.fullName?.[0] || user?.username?.[0] || '?'}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user?.fullName || user?.username}</p>
            <p className={styles.userRole}>{user?.role}</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
