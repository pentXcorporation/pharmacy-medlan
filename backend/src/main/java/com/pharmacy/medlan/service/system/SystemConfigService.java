package com.pharmacy.medlan.service.system;

import com.pharmacy.medlan.model.system.SystemConfig;

import java.util.List;

public interface SystemConfigService {

    SystemConfig getById(Long id);

    SystemConfig getByConfigKey(String configKey);

    List<SystemConfig> getByCategory(String category);

    List<SystemConfig> getEditableConfigs();

    List<SystemConfig> getAllConfigs();

    SystemConfig createConfig(SystemConfig config);

    SystemConfig updateConfigValue(Long id, String configValue);

    void deleteConfig(Long id);
}
