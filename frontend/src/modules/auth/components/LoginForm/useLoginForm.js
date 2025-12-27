import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';
import { useAuthStore } from '../../store/authSlice';
import { getDefaultPathForRole } from '../../utils/authHelpers';
import { toast } from 'sonner';

/**
 * useLoginForm Hook
 * Custom hook for LoginForm component logic
 */
export function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (error) setError(null);
  }, [error]);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  /**
   * Validate form
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
   * Handle form submit
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
        
        // Navigate to default path
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

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      password: '',
      rememberMe: false,
    });
    setError(null);
  }, []);

  return {
    formData,
    isLoading,
    error,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    resetForm,
    setError,
  };
}

export default useLoginForm;
