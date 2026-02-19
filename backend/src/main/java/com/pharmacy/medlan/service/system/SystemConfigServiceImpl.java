package com.pharmacy.medlan.service.system;

import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.system.SystemConfig;
import com.pharmacy.medlan.repository.system.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Override
    @Transactional(readOnly = true)
    public SystemConfig getById(Long id) {
        return systemConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("System config not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public SystemConfig getByConfigKey(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey)
                .orElseThrow(() -> new ResourceNotFoundException("System config not found with key: " + configKey));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> getByCategory(String category) {
        return systemConfigRepository.findByCategory(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> getEditableConfigs() {
        return systemConfigRepository.findByIsEditableTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> getAllConfigs() {
        return systemConfigRepository.findAll();
    }

    @Override
    public SystemConfig createConfig(SystemConfig config) {
        log.info("Creating system config with key: {}", config.getConfigKey());
        return systemConfigRepository.save(config);
    }

    @Override
    public SystemConfig updateConfigValue(Long id, String configValue) {
        SystemConfig config = getById(id);
        if (!config.getIsEditable()) {
            throw new IllegalStateException("Configuration '" + config.getConfigKey() + "' is not editable");
        }
        config.setConfigValue(configValue);
        log.info("Updated system config '{}' value", config.getConfigKey());
        return systemConfigRepository.save(config);
    }

    @Override
    public void deleteConfig(Long id) {
        SystemConfig config = getById(id);
        log.info("Deleting system config with key: {}", config.getConfigKey());
        systemConfigRepository.delete(config);
    }
}
