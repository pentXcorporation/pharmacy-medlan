import { useState } from "react";
import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "@/config";

export const useScan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const processScan = async ({ scanData, context = "POS", branchId }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Assuming you have an axios instance set up, otherwise use fetch
      // Using standard fetch for portability in this example
      const token = localStorage.getItem(API_CONFIG.TOKEN.ACCESS_KEY);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCAN.PROCESS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scanData,
          context,
          branchId,
          isQrCode: scanData.startsWith("{") || scanData.length > 20 // Simple heuristic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Scan processing failed");
      }

      return data; // Returns the ScanResultResponse object from backend
    } catch (err) {
      const msg = err.message || "Network error occurred";
      setError(msg);
      return { success: false, errorMessage: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processScan,
    isLoading,
    error
  };
};