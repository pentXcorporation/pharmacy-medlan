import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import styles from './LoginForm.module.css';

/**
 * LoginForm Component
 * Handles user authentication form
 */
export function LoginForm({ onSuccess, onForgotPassword }) {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (e) => {
    const result = await handleSubmit(e);
    if (result?.success && onSuccess) {
      onSuccess(result.data);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.form}>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          autoComplete="username"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className={styles.options}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>Remember me</span>
        </label>
        
        {onForgotPassword && (
          <button
            type="button"
            className={styles.forgotPassword}
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        )}
      </div>

      <Button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

export default LoginForm;
