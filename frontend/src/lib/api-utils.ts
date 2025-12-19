// Utility to safely extract data from API responses
export const safeApiCall = async <T>(
  apiCall: Promise<any>,
  defaultValue: T
): Promise<T> => {
  try {
    const response = await apiCall;
    return response.data?.data?.content || response.data?.data || defaultValue;
  } catch (error) {
    console.error('API call failed:', error);
    return defaultValue;
  }
};
