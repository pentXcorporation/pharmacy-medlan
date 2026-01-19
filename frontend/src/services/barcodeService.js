/**
 * Barcode Service
 * API calls for barcode generation and management
 */

import api from "@/utils/api";

export const barcodeService = {
  /**
   * Generate unique barcode
   */
  generateUnique: async (prefix = "MED") => {
    const response = await api.get(`/barcodes/generate-unique`, {
      params: { prefix },
    });
    return response.data?.data || response.data || response;
  },

  /**
   * Generate barcode for product
   */
  generateForProduct: async (productId) => {
    const response = await api.post(`/barcodes/generate`, {
      productId,
    });
    return response.data?.data || response.data || response;
  },

  /**
   * Get barcode image for product
   */
  getBarcodeImage: async (productId) => {
    const response = await api.get(`/barcodes/product/${productId}`);
    return response.data?.data || response.data || response;
  },

  /**
   * Generate QR code for product
   */
  generateQRCode: async (productId) => {
    const response = await api.get(`/barcodes/qr/product/${productId}`);
    return response.data?.data || response.data || response;
  },

  /**
   * Validate barcode
   */
  validate: async (barcode) => {
    const response = await api.get(`/barcodes/validate`, {
      params: { barcode },
    });
    return response.data?.data || response.data || response;
  },
};

export default barcodeService;
