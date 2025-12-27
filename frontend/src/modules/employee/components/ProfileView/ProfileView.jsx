import { useState } from 'react';
import { useProfile, useUpdateProfile, useNotifications, useMarkNotificationRead } from '../../hooks';
import { NOTIFICATION_TYPES } from '../../constants';
import styles from './ProfileView.module.css';

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: profileData, isLoading } = useProfile();
  const { data: notificationsData } = useNotifications({ unread: true });
  const updateProfile = useUpdateProfile();
  const markRead = useMarkNotificationRead();

  const profile = profileData?.data || {};
  const notifications = notificationsData?.data || [];

  const handleEdit = () => {
    setFormData({
      phone: profile.phone || '',
      emergency_contact: profile.emergency_contact || '',
      address: profile.address || '',
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'leave':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'announcement':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'schedule':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className={styles.profileView}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} />
          ) : (
            <span>{profile.name?.charAt(0) || 'U'}</span>
          )}
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.name}>{profile.name || 'Employee'}</h2>
          <p className={styles.role}>{profile.role || 'Staff'}</p>
          <p className={styles.email}>{profile.email}</p>
        </div>
        {!isEditing && (
          <button onClick={handleEdit} className={styles.editBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Details */}
      <div className={styles.profileDetails}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        
        {isEditing ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emergency_contact">Emergency Contact</label>
              <input
                type="tel"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                placeholder="Emergency contact number"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter your address"
              />
            </div>

            <div className={styles.formActions}>
              <button onClick={handleCancel} className={styles.cancelBtn}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={styles.saveBtn}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Employee ID</span>
              <span className={styles.infoValue}>{profile.employee_id || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Department</span>
              <span className={styles.infoValue}>{profile.department || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>{profile.phone || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Emergency Contact</span>
              <span className={styles.infoValue}>{profile.emergency_contact || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Join Date</span>
              <span className={styles.infoValue}>
                {profile.join_date
                  ? new Date(profile.join_date).toLocaleDateString()
                  : '-'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Branch</span>
              <span className={styles.infoValue}>{profile.branch_name || '-'}</span>
            </div>
            <div className={`${styles.infoItem} ${styles.infoItemFull}`}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>{profile.address || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className={styles.notifications}>
          <h3 className={styles.sectionTitle}>
            Unread Notifications
            <span className={styles.badge}>{notifications.length}</span>
          </h3>
          <ul className={styles.notificationList}>
            {notifications.slice(0, 5).map((notification) => (
              <li key={notification.id} className={styles.notificationItem}>
                <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className={styles.notificationContent}>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <span className={styles.notificationTime}>
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <button
                  onClick={() => handleMarkRead(notification.id)}
                  className={styles.markReadBtn}
                  title="Mark as read"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
