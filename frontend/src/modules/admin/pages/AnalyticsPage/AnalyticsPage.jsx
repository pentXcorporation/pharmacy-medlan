import { Analytics } from '../../components/Analytics';
import styles from './AnalyticsPage.module.css';

/**
 * AnalyticsPage
 * System analytics page
 */
export function AnalyticsPage() {
  return (
    <div className={styles.page}>
      <Analytics />
    </div>
  );
}

export default AnalyticsPage;
