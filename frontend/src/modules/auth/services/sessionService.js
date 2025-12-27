import { SESSION_CONFIG } from '../constants/authConstants';
import { tokenService } from './tokenService';

/**
 * Session Service
 * Handles session management, timeouts, and activity tracking
 */
class SessionServiceClass {
  constructor() {
    this.idleTimeout = null;
    this.warningTimeout = null;
    this.sessionStartTime = null;
    this.lastActivityTime = null;
    this.onSessionExpired = null;
    this.onSessionWarning = null;
    this.isActive = false;
  }

  /**
   * Initialize session tracking
   * @param {Object} options - { onExpired, onWarning }
   */
  init({ onExpired, onWarning }) {
    this.onSessionExpired = onExpired;
    this.onSessionWarning = onWarning;
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
    this.isActive = true;

    this.setupActivityListeners();
    this.startIdleTimer();
  }

  /**
   * Setup activity listeners
   */
  setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.onActivity(), { passive: true });
    });
  }

  /**
   * Handle user activity
   */
  onActivity() {
    if (!this.isActive) return;
    
    this.lastActivityTime = Date.now();
    this.resetIdleTimer();
  }

  /**
   * Start idle timer
   */
  startIdleTimer() {
    this.clearTimers();

    // Warning timeout
    const warningTime = SESSION_CONFIG.IDLE_TIMEOUT - SESSION_CONFIG.TIMEOUT_WARNING;
    this.warningTimeout = setTimeout(() => {
      if (this.onSessionWarning) {
        this.onSessionWarning();
      }
    }, warningTime);

    // Expiry timeout
    this.idleTimeout = setTimeout(() => {
      this.handleSessionExpired();
    }, SESSION_CONFIG.IDLE_TIMEOUT);
  }

  /**
   * Reset idle timer
   */
  resetIdleTimer() {
    this.startIdleTimer();
  }

  /**
   * Clear all timers
   */
  clearTimers() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
  }

  /**
   * Handle session expired
   */
  handleSessionExpired() {
    this.destroy();
    tokenService.clearAll();
    
    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
  }

  /**
   * Extend session
   */
  extendSession() {
    this.lastActivityTime = Date.now();
    this.resetIdleTimer();
  }

  /**
   * Check if session is valid
   * @returns {boolean}
   */
  isSessionValid() {
    if (!this.isActive || !this.sessionStartTime) {
      return false;
    }

    const sessionDuration = Date.now() - this.sessionStartTime;
    return sessionDuration < SESSION_CONFIG.MAX_SESSION_DURATION;
  }

  /**
   * Get time until session expires
   * @returns {number} - Milliseconds until expiry
   */
  getTimeUntilExpiry() {
    if (!this.lastActivityTime) return 0;
    
    const elapsed = Date.now() - this.lastActivityTime;
    return Math.max(0, SESSION_CONFIG.IDLE_TIMEOUT - elapsed);
  }

  /**
   * Get session duration
   * @returns {number} - Session duration in milliseconds
   */
  getSessionDuration() {
    if (!this.sessionStartTime) return 0;
    return Date.now() - this.sessionStartTime;
  }

  /**
   * Destroy session service
   */
  destroy() {
    this.clearTimers();
    this.isActive = false;
    this.sessionStartTime = null;
    this.lastActivityTime = null;
  }
}

export const sessionService = new SessionServiceClass();
export default sessionService;
