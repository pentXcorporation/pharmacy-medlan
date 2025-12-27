import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useSystemSettings } from '../../hooks/useSystemSettings';
import { SETTINGS_CATEGORIES } from '../../constants';
import styles from './SystemSettings.module.css';

/**
 * SystemSettings Component
 * System configuration management
 */
export function SystemSettings() {
  const { 
    settings, 
    isLoading, 
    updateMutation,
    bulkUpdateMutation,
    resetMutation,
  } = useSystemSettings();

  const [activeCategory, setActiveCategory] = useState(SETTINGS_CATEGORIES.GENERAL);
  const [editedSettings, setEditedSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (Object.keys(editedSettings).length > 0) {
      bulkUpdateMutation.mutate(editedSettings, {
        onSuccess: () => {
          setEditedSettings({});
          setHasChanges(false);
        },
      });
    }
  };

  const handleReset = (category) => {
    if (window.confirm(`Are you sure you want to reset ${category} settings to default?`)) {
      resetMutation.mutate(category);
    }
  };

  const getSettingValue = (key) => {
    return editedSettings[key] ?? settings?.[key] ?? '';
  };

  const renderSettingInput = (setting) => {
    const value = getSettingValue(setting.key);

    switch (setting.type) {
      case 'boolean':
        return (
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className={styles.select}
          >
            {setting.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            min={setting.min}
            max={setting.max}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          />
        );
    }
  };

  const settingsConfig = {
    [SETTINGS_CATEGORIES.GENERAL]: [
      { key: 'company_name', label: 'Company Name', type: 'text' },
      { key: 'company_address', label: 'Company Address', type: 'text' },
      { key: 'company_phone', label: 'Company Phone', type: 'text' },
      { key: 'company_email', label: 'Company Email', type: 'text' },
      { key: 'currency', label: 'Currency', type: 'select', options: [
        { value: 'LKR', label: 'Sri Lankan Rupee (LKR)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
      ]},
      { key: 'timezone', label: 'Timezone', type: 'select', options: [
        { value: 'Asia/Colombo', label: 'Asia/Colombo' },
        { value: 'UTC', label: 'UTC' },
      ]},
    ],
    [SETTINGS_CATEGORIES.INVENTORY]: [
      { key: 'low_stock_threshold', label: 'Low Stock Threshold', type: 'number', min: 1 },
      { key: 'enable_auto_reorder', label: 'Enable Auto Reorder', type: 'boolean' },
      { key: 'reorder_quantity_multiplier', label: 'Reorder Quantity Multiplier', type: 'number', min: 1 },
      { key: 'enable_batch_tracking', label: 'Enable Batch Tracking', type: 'boolean' },
      { key: 'enable_expiry_tracking', label: 'Enable Expiry Tracking', type: 'boolean' },
      { key: 'expiry_warning_days', label: 'Expiry Warning Days', type: 'number', min: 1 },
    ],
    [SETTINGS_CATEGORIES.SALES]: [
      { key: 'enable_discounts', label: 'Enable Discounts', type: 'boolean' },
      { key: 'max_discount_percentage', label: 'Max Discount (%)', type: 'number', min: 0, max: 100 },
      { key: 'enable_credit_sales', label: 'Enable Credit Sales', type: 'boolean' },
      { key: 'receipt_footer', label: 'Receipt Footer Text', type: 'text' },
      { key: 'enable_print_receipt', label: 'Auto Print Receipt', type: 'boolean' },
    ],
    [SETTINGS_CATEGORIES.NOTIFICATIONS]: [
      { key: 'enable_email_notifications', label: 'Enable Email Notifications', type: 'boolean' },
      { key: 'enable_low_stock_alerts', label: 'Low Stock Alerts', type: 'boolean' },
      { key: 'enable_expiry_alerts', label: 'Expiry Alerts', type: 'boolean' },
      { key: 'notification_email', label: 'Notification Email', type: 'text' },
    ],
    [SETTINGS_CATEGORIES.SECURITY]: [
      { key: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', min: 5 },
      { key: 'max_login_attempts', label: 'Max Login Attempts', type: 'number', min: 1 },
      { key: 'password_min_length', label: 'Min Password Length', type: 'number', min: 6 },
      { key: 'require_password_change', label: 'Require Password Change', type: 'boolean' },
      { key: 'password_change_days', label: 'Password Change Interval (days)', type: 'number', min: 30 },
      { key: 'enable_two_factor', label: 'Enable Two-Factor Auth', type: 'boolean' },
    ],
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading settings...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        {hasChanges && (
          <div className={styles.actions}>
            <Button variant="outline" onClick={() => {
              setEditedSettings({});
              setHasChanges(false);
            }}>
              Discard Changes
            </Button>
            <Button onClick={handleSave} disabled={bulkUpdateMutation.isPending}>
              {bulkUpdateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {/* Category Navigation */}
        <div className={styles.sidebar}>
          {Object.values(SETTINGS_CATEGORIES).map(category => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <Card className={styles.settingsPanel}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.categoryTitle}>
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Settings
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleReset(activeCategory)}
            >
              Reset to Default
            </Button>
          </CardHeader>
          <CardContent>
            <div className={styles.settingsList}>
              {settingsConfig[activeCategory]?.map(setting => (
                <div key={setting.key} className={styles.settingItem}>
                  <div className={styles.settingLabel}>
                    <label>{setting.label}</label>
                  </div>
                  <div className={styles.settingInput}>
                    {renderSettingInput(setting)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SystemSettings;
