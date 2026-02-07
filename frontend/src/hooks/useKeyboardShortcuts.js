import { useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for managing keyboard shortcuts in POS system
 * Provides centralized keyboard event handling with debouncing and conflict prevention
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  const lastKeyTimeRef = useRef({});
  const debounceDelayRef = useRef(100); // ms

  // Check if key press is valid (no debounce conflict)
  const isValidKeyPress = useCallback((key) => {
    const now = Date.now();
    const lastTime = lastKeyTimeRef.current[key] || 0;
    const isValid = now - lastTime > debounceDelayRef.current;
    lastKeyTimeRef.current[key] = now;
    return isValid;
  }, []);

  // Check if input element is focused
  const isInputFocused = useCallback(() => {
    const activeElement = document.activeElement;
    return (
      activeElement?.tagName === "INPUT" ||
      activeElement?.tagName === "TEXTAREA" ||
      activeElement?.contentEditable === "true"
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Create keyboard event identifier
      const key = `${e.ctrlKey ? "ctrl+" : ""}${e.shiftKey ? "shift+" : ""}${e.altKey ? "alt+" : ""}${e.key.toLowerCase()}`;
      const keyCode = `${e.ctrlKey ? "ctrl+" : ""}${e.shiftKey ? "shift+" : ""}${e.altKey ? "alt+" : ""}${e.code.toLowerCase()}`;

      // Check if shortcut exists
      const shortcut = shortcuts[key] || shortcuts[keyCode];

      if (shortcut) {
        // Prevent default if callback exists and is valid
        if (shortcut.callback && !shortcut.allowInInput && isInputFocused()) {
          // Allow shortcut in input if explicitly allowed
          if (!shortcut.allowInInput) {
            return;
          }
        }

        // Check debounce
        if (!isValidKeyPress(key)) {
          return;
        }

        // Prevent default browser behavior
        if (shortcut.preventDefault !== false) {
          e.preventDefault();
        }

        // Execute callback
        if (shortcut.callback && typeof shortcut.callback === "function") {
          shortcut.callback(e);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts, isInputFocused, isValidKeyPress]);

  return { isInputFocused };
};

/**
 * Commonly used keyboard shortcuts for POS system
 */
export const POS_SHORTCUTS = {
  // Main actions
  HOLD_SALE: "f12", // or 'ctrl+h'
  CLEAR_CART: "delete", // or 'ctrl+l'
  COMPLETE_SALE: "f9", // or 'ctrl+enter'
  PRINT_RECEIPT: "ctrl+p",

  // Navigation
  FOCUS_SEARCH: "ctrl+f",
  FOCUS_PAYMENT: "ctrl+shift+p",
  NEXT_FIELD: "tab",
  PREV_FIELD: "shift+tab",

  // Product selection
  SELECT_PRODUCT: "enter",
  CANCEL_SEARCH: "escape",
  NEXT_RESULT: "arrowdown",
  PREV_RESULT: "arrowup",
  SELECT_BATCH: "alt+b",

  // Field focus shortcuts
  FOCUS_CUSTOMER: "alt+u",
  FOCUS_DISCOUNT: "alt+d",
  FOCUS_AMOUNT_TENDERED: "alt+t",

  // Payment methods
  SELECT_CASH: "ctrl+1",
  SELECT_CARD: "ctrl+2",
  SELECT_UPI: "ctrl+3",
  NEXT_PAYMENT_METHOD: "arrowright",
  PREV_PAYMENT_METHOD: "arrowleft",

  // Quantity adjustment
  INCREASE_QUANTITY: "+",
  DECREASE_QUANTITY: "-",

  // Dialog navigation
  CONFIRM_DIALOG: "enter",
  CANCEL_DIALOG: "escape",
  NEXT_DIALOG_OPTION: "arrowright",
  PREV_DIALOG_OPTION: "arrowleft",
};

/**
 * Focus management utility for POS system
 * Helps navigate between different panel sections
 */
export const focusManager = {
  // Panel IDs
  PANEL_SEARCH: "pos-search-panel",
  PANEL_CART: "pos-cart-panel",
  PANEL_CUSTOMER: "pos-customer-panel",
  PANEL_DISCOUNT: "pos-discount-panel",
  PANEL_PAYMENT: "pos-payment-panel",
  PANEL_ACTIONS: "pos-actions-panel",

  /**
   * Focus the first interactive element in a panel
   */
  focusPanel: (panelId) => {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const firstFocusable = panel.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  },

  /**
   * Move focus to next interactive element within a container
   */
  focusNext: (containerId, currentElement) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );

    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;

    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
    }
  },

  /**
   * Move focus to previous interactive element within a container
   */
  focusPrevious: (containerId, currentElement) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );

    const currentIndex = focusableElements.indexOf(currentElement);
    const prevIndex =
      currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;

    if (focusableElements[prevIndex]) {
      focusableElements[prevIndex].focus();
    }
  },

  /**
   * Get all focusable elements in a container
   */
  getFocusableElements: (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return [];

    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  },
};

/**
 * Announce to screen readers and show visual toast for keyboard actions
 */
export const announceKeyboardAction = (message) => {
  // Create aria-live region if it doesn't exist
  let liveRegion = document.getElementById("keyboard-announcement");
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "keyboard-announcement";
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only"; // screen reader only
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = message;
};
