import styles from './Spinner.module.css';
import { cn } from '@/shared/utils';

/**
 * Spinner Component
 * Loading spinner indicator
 */
export function Spinner({ size = 'md', className }) {
  return (
    <div className={cn(styles.spinner, styles[size], className)}>
      <div className={styles.circle}></div>
    </div>
  );
}

export default Spinner;
