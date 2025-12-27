import { SystemSettings } from '../../components/SystemSettings';
import styles from './SettingsPage.module.css';

/**
 * SettingsPage
 * System settings management page
 */
export function SettingsPage() {
  return (
    <div className={styles.page}>
      <SystemSettings />
    </div>
  );
}

export default SettingsPage;
