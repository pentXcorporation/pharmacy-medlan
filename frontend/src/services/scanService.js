/**
 * Scan Service
 * Handles barcode/QR code scanning operations
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const scanService = {
  /**
   * Process a scan (auto-detect barcode/QR)
   */
  process: (data) => {
    return api.post(API_ENDPOINTS.SCAN.PROCESS, data);
  },

  /**
   * POS barcode lookup
   */
  posLookup: (barcode) => {
    return api.get(API_ENDPOINTS.SCAN.POS_LOOKUP(barcode));
  },

  /**
   * Receiving barcode lookup (for GRN)
   */
  receivingLookup: (barcode) => {
    return api.get(API_ENDPOINTS.SCAN.RECEIVING_LOOKUP(barcode));
  },

  /**
   * Stock-taking barcode lookup
   */
  stockTakingLookup: (barcode) => {
    return api.get(API_ENDPOINTS.SCAN.STOCK_TAKING(barcode));
  },

  /**
   * Verify a scanned code
   */
  verify: (data) => {
    return api.post(API_ENDPOINTS.SCAN.VERIFY, data);
  },

  /**
   * Generate batch QR codes
   */
  batchQR: (data) => {
    return api.post(API_ENDPOINTS.SCAN.BATCH_QR, data);
  },

  /**
   * Bulk scan processing
   */
  bulkScan: (data) => {
    return api.post(API_ENDPOINTS.SCAN.BULK, data);
  },

  /**
   * Get scan history
   */
  getHistory: (params = {}) => {
    return api.get(API_ENDPOINTS.SCAN.HISTORY, { params });
  },

  /**
   * Get available scan contexts
   */
  getContexts: () => {
    return api.get(API_ENDPOINTS.SCAN.CONTEXTS);
  },
};

export default scanService;
