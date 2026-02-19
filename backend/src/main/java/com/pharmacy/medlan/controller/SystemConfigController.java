package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.system.SystemConfig;
import com.pharmacy.medlan.service.system.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-config")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "System Configuration", description = "System configuration management APIs")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @GetMapping
    @Operation(summary = "Get all configurations")
    public ResponseEntity<ApiResponse<List<SystemConfig>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(systemConfigService.getAllConfigs()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get configuration by ID")
    public ResponseEntity<ApiResponse<SystemConfig>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(systemConfigService.getById(id)));
    }

    @GetMapping("/key/{configKey}")
    @Operation(summary = "Get configuration by key")
    public ResponseEntity<ApiResponse<SystemConfig>> getByKey(@PathVariable String configKey) {
        return ResponseEntity.ok(ApiResponse.success(systemConfigService.getByConfigKey(configKey)));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get configurations by category")
    public ResponseEntity<ApiResponse<List<SystemConfig>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(systemConfigService.getByCategory(category)));
    }

    @GetMapping("/editable")
    @Operation(summary = "Get editable configurations")
    public ResponseEntity<ApiResponse<List<SystemConfig>>> getEditable() {
        return ResponseEntity.ok(ApiResponse.success(systemConfigService.getEditableConfigs()));
    }

    @PostMapping
    @Operation(summary = "Create configuration")
    public ResponseEntity<ApiResponse<SystemConfig>> create(@RequestBody SystemConfig config) {
        SystemConfig created = systemConfigService.createConfig(config);
        return ResponseEntity.ok(ApiResponse.success("Configuration created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update configuration value")
    public ResponseEntity<ApiResponse<SystemConfig>> updateValue(
            @PathVariable Long id,
            @RequestParam String configValue) {
        SystemConfig updated = systemConfigService.updateConfigValue(id, configValue);
        return ResponseEntity.ok(ApiResponse.success("Configuration updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete configuration")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        systemConfigService.deleteConfig(id);
        return ResponseEntity.ok(ApiResponse.success("Configuration deleted successfully"));
    }
}
