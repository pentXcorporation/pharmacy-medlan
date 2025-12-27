// Employee Hooks - Profile
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services';

export const PROFILE_QUERY_KEYS = {
  profile: 'employee-profile',
  notifications: 'employee-notifications',
  activity: 'employee-activity',
};

// My Profile Hook
export const useMyProfile = () => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEYS.profile],
    queryFn: profileService.getMyProfile,
  });
};

// Update Profile Hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.profile] });
    },
  });
};

// Update Profile Picture Hook
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.profile] });
    },
  });
};

// Change Password Hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileService.changePassword,
  });
};

// Notifications Hook
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEYS.notifications, params],
    queryFn: () => profileService.getNotifications(params),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};

// Mark Notification Read Hook
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.notifications] });
    },
  });
};

// Mark All Notifications Read Hook
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEYS.notifications] });
    },
  });
};

// Activity Hook
export const useMyActivity = (params = {}) => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEYS.activity, params],
    queryFn: () => profileService.getMyActivity(params),
  });
};
