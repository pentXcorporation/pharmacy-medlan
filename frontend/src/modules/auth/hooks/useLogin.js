import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authSlice';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
import { getDefaultPathForRole } from '../utils/authHelpers';
import { toast } from 'sonner';

/**
 * useLogin Hook
 * Handles login functionality with form state management
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  /**
   * Update form field
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  /**
   * Handle form change event
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    updateField(name, type === 'checkbox' ? checked : value);
  }, [updateField]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      password: '',
      rememberMe: false,
    });
    setError(null);
  }, []);

  /**
   * Validate form data
   */
  const validateForm = useCallback(() => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  }, [formData]);

  /**
   * Submit login form
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, ...userData } = response.data;
        
        // Store tokens
        tokenService.setTokens(accessToken, refreshToken);
        
        // Update auth store
        login(userData, accessToken);
        
        // Show success message
        toast.success('Login successful!');
        
        // Navigate to default path for user's role
        const defaultPath = getDefaultPathForRole(userData.role);
        setTimeout(() => navigate(defaultPath), 100);
        
        return { success: true, data: userData };
      }
      
      throw new Error('Invalid response from server');
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [formData, login, navigate, validateForm]);

  return {
    // State
    formData,
    isLoading,
    error,
    
    // Actions
    updateField,
    handleChange,
    handleSubmit,
    resetForm,
    setError,
  };
}

export default useLogin;
