package com.pharmacy.medlan.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for System Metrics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemMetricsResponse {
    private String status;
    private Double uptime;
    private Long responseTime;
    private Integer activeUsers;
    private Integer activeSessions;
    private Integer dbConnections;
    private Integer maxDbConnections;
    private Double errorRate;
    private LocalDateTime lastBackup;
    private MemoryMetrics memory;
    private CpuMetrics cpu;
    private LocalDateTime timestamp;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemoryMetrics {
        private Long used;
        private Long max;
        private Long free;
        private Double usagePercentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CpuMetrics {
        private Double usage;
        private Integer cores;
        private Double loadAverage;
    }
}
