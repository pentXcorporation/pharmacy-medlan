import { cn } from '@/shared/utils';
import styles from './Badge.module.css';

/**
 * Badge Component
 * Status indicator badges
 */
export function Badge({ 
  className, 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}) {
  return (
    <span 
      className={cn(styles.badge, styles[variant], styles[size], className)} 
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
