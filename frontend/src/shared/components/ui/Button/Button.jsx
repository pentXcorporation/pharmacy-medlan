import { forwardRef } from 'react';
import { cn } from '@/shared/utils';
import styles from './Button.module.css';

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */
const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        className
      )}
      {...props}
    >
      {loading && (
        <span className={styles.spinner}>
          <svg className={styles.spinnerIcon} viewBox="0 0 24 24">
            <circle
              className={styles.spinnerCircle}
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;
