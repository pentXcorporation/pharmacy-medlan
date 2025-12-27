import { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import styles from './TwoFactorAuth.module.css';

/**
 * TwoFactorAuth Component
 * Handles two-factor authentication code input
 */
export function TwoFactorAuth({ 
  onSubmit, 
  onResend, 
  isLoading = false, 
  error = null,
  codeLength = 6,
  resendCooldown = 60,
}) {
  const [code, setCode] = useState(Array(codeLength).fill(''));
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === codeLength - 1 && newCode.every(c => c)) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, codeLength);
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < codeLength) newCode[i] = char;
    });
    setCode(newCode);

    // Focus last filled input or submit
    const lastIndex = Math.min(pastedData.length, codeLength) - 1;
    inputRefs.current[lastIndex]?.focus();

    if (newCode.every(c => c)) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleSubmit = (codeValue) => {
    if (onSubmit) {
      onSubmit(codeValue || code.join(''));
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    
    if (onResend) {
      onResend();
      setCountdown(resendCooldown);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (code.every(c => c)) {
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Two-Factor Authentication</h2>
        <p className={styles.subtitle}>
          Enter the verification code sent to your device
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.codeInputs} onPaste={handlePaste}>
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.codeInput}
              disabled={isLoading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !code.every(c => c)}
          className={styles.submitButton}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>

      <div className={styles.resend}>
        <span className={styles.resendText}>Didn't receive the code?</span>
        <button
          type="button"
          className={styles.resendButton}
          onClick={handleResend}
          disabled={countdown > 0 || isLoading}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
}

export default TwoFactorAuth;
