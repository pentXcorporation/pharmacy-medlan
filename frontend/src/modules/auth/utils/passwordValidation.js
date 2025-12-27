import { PASSWORD_REQUIREMENTS } from '../constants/authConstants';

/**
 * Password Validation Utilities
 */

/**
 * Validate password against requirements
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid, errors }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`);
  }
  
  // Check maximum length
  if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
    errors.push(`Password must be at most ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`);
  }
  
  // Check uppercase requirement
  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check lowercase requirement
  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check number requirement
  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check special character requirement
  if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate password strength
 * @param {string} password - Password to evaluate
 * @returns {Object} - { score, level, feedback }
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return { score: 0, level: 'none', feedback: 'Enter a password' };
  }
  
  let score = 0;
  const feedback = [];
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Bonus for mixed characters
  if (/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
  
  // Penalties
  if (/^[a-zA-Z]+$/.test(password)) {
    score -= 1;
    feedback.push('Add numbers for stronger password');
  }
  if (/^[0-9]+$/.test(password)) {
    score -= 2;
    feedback.push('Add letters for stronger password');
  }
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeated characters');
  }
  
  // Common patterns penalty
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 2;
    feedback.push('Avoid common patterns');
  }
  
  // Normalize score
  score = Math.max(0, Math.min(score, 10));
  
  // Determine level
  let level;
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'fair';
  else if (score <= 6) level = 'good';
  else if (score <= 8) level = 'strong';
  else level = 'excellent';
  
  // Add positive feedback if strong
  if (score >= 7 && feedback.length === 0) {
    feedback.push('Great password!');
  }
  
  return { score, level, feedback };
};

/**
 * Check if passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean}
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Get password strength color
 * @param {string} level - Strength level
 * @returns {string} - Color code
 */
export const getPasswordStrengthColor = (level) => {
  const colors = {
    none: 'gray',
    weak: 'red',
    fair: 'orange',
    good: 'yellow',
    strong: 'lime',
    excellent: 'green',
  };
  
  return colors[level] || 'gray';
};

/**
 * Generate password requirements text
 * @returns {string[]} - Array of requirement descriptions
 */
export const getPasswordRequirements = () => {
  const requirements = [];
  
  requirements.push(`At least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`);
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE) {
    requirements.push('At least one uppercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE) {
    requirements.push('At least one lowercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER) {
    requirements.push('At least one number');
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL) {
    requirements.push('At least one special character');
  }
  
  return requirements;
};
