import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { authService } from '../../services/authService';
import { toast } from 'sonner';
import styles from './ForgotPasswordForm.module.css';

/**
 * ForgotPasswordForm Component
 * Handles password reset request
 */
export function ForgotPasswordForm({ onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset link sent to your email');
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Check your email</h3>
        <p className={styles.successMessage}>
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className={styles.successNote}>
          Didn't receive the email? Check your spam folder or try again.
        </p>
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Try again
          </Button>
          {onBack && (
            <Button onClick={onBack}>
              Back to login
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          disabled={isLoading}
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.actions}>
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
