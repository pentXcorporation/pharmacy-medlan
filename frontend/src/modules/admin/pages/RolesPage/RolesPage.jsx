import { RolePermissions } from '../../components/RolePermissions';
import styles from './RolesPage.module.css';

/**
 * RolesPage
 * Role and permission management page
 */
export function RolesPage() {
  return (
    <div className={styles.page}>
      <RolePermissions />
    </div>
  );
}

export default RolesPage;
