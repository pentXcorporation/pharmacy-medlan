import { forwardRef } from 'react';
import { cn } from '@/shared/utils';
import styles from './Select.module.css';

/**
 * Select Component
 * Dropdown select input
 */
const Select = forwardRef(({
  className,
  error,
  label,
  helperText,
  options = [],
  placeholder = 'Select an option',
  ...props
}, ref) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>{label}</label>
      )}
      <select
        ref={ref}
        className={cn(styles.select, error && styles.error, className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={cn(styles.helperText, error && styles.errorText)}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
export default Select;
