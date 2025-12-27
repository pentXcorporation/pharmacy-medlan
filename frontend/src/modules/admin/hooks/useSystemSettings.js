import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import { toast } from 'sonner';

/**
 * useSystemSettings Hook
 * Manages system settings
 */
export function useSystemSettings(category = null) {
  const queryClient = useQueryClient();
  
  const SETTINGS_KEY = category 
    ? ['settings', category] 
    : ['settings'];

  const {
    data: settingsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => category 
      ? settingsService.getByCategory(category)
      : settingsService.getAll(),
  });

  // Update setting mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, value }) => settingsService.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Setting updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update setting');
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: settingsService.updateBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  // Reset to defaults mutation
  const resetMutation = useMutation({
    mutationFn: settingsService.resetToDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings reset to defaults');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset settings');
    },
  });

  return {
    // Data
    settings: settingsData?.data || {},
    isLoading,
    error,

    // Actions
    refetch,
    updateSetting: updateMutation.mutate,
    updateSettings: bulkUpdateMutation.mutate,
    resetToDefaults: resetMutation.mutate,

    // Loading states
    isUpdating: updateMutation.isPending || bulkUpdateMutation.isPending,
    isResetting: resetMutation.isPending,
  };
}

export default useSystemSettings;
