import { forwardRef } from 'react';
import { cn } from '@/shared/utils';
import styles from './Input.module.css';

/**
 * Input Component
 * Reusable input field with various states
 */
const Input = forwardRef(({
  className,
  type = 'text',
  error,
  label,
  helperText,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>{label}</label>
      )}
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <span className={styles.leftIcon}>{leftIcon}</span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            styles.input,
            error && styles.error,
            leftIcon && styles.hasLeftIcon,
            rightIcon && styles.hasRightIcon,
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className={styles.rightIcon}>{rightIcon}</span>
        )}
      </div>
      {(error || helperText) && (
        <p className={cn(styles.helperText, error && styles.errorText)}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
