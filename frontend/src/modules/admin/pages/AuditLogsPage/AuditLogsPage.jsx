import { AuditLogs } from '../../components/AuditLogs';
import styles from './AuditLogsPage.module.css';

/**
 * AuditLogsPage
 * System audit logs page
 */
export function AuditLogsPage() {
  return (
    <div className={styles.page}>
      <AuditLogs />
    </div>
  );
}

export default AuditLogsPage;
