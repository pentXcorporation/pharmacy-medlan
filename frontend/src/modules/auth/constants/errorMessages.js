// Auth Error Messages

export const AUTH_ERROR_MESSAGES = {
  // Login errors
  INVALID_CREDENTIALS: 'Invalid username or password',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
  ACCOUNT_DISABLED: 'Your account has been disabled.',
  ACCOUNT_NOT_VERIFIED: 'Please verify your email before logging in.',
  
  // Session errors
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SESSION_INVALID: 'Invalid session. Please login again.',
  
  // Token errors
  TOKEN_EXPIRED: 'Your authentication token has expired.',
  TOKEN_INVALID: 'Invalid authentication token.',
  TOKEN_MISSING: 'Authentication token is missing.',
  REFRESH_TOKEN_EXPIRED: 'Your refresh token has expired. Please login again.',
  
  // Authorization errors
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions.',
  ROLE_REQUIRED: 'This action requires a specific role.',
  
  // Password errors
  PASSWORD_MISMATCH: 'Passwords do not match.',
  PASSWORD_TOO_WEAK: 'Password is too weak.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORD_REQUIRES_UPPERCASE: 'Password must contain an uppercase letter.',
  PASSWORD_REQUIRES_LOWERCASE: 'Password must contain a lowercase letter.',
  PASSWORD_REQUIRES_NUMBER: 'Password must contain a number.',
  PASSWORD_REQUIRES_SPECIAL: 'Password must contain a special character.',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect.',
  PASSWORD_SAME_AS_OLD: 'New password cannot be the same as the old password.',
  
  // Two-factor authentication errors
  TWO_FACTOR_REQUIRED: 'Two-factor authentication is required.',
  TWO_FACTOR_INVALID_CODE: 'Invalid verification code.',
  TWO_FACTOR_CODE_EXPIRED: 'Verification code has expired.',
  TWO_FACTOR_MAX_ATTEMPTS: 'Maximum verification attempts exceeded.',
  
  // Registration errors
  USERNAME_TAKEN: 'This username is already taken.',
  EMAIL_TAKEN: 'This email is already registered.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  
  // General errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
  
  // Rate limiting
  TOO_MANY_ATTEMPTS: 'Too many attempts. Please try again later.',
  LOGIN_RATE_LIMITED: 'Too many login attempts. Please wait before trying again.',
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: 'Must be at least {{min}} characters',
  MAX_LENGTH: 'Must be at most {{max}} characters',
};

export default AUTH_ERROR_MESSAGES;
