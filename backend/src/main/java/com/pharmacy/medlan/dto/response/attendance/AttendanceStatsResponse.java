package com.pharmacy.medlan.dto.response.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStatsResponse {
    private Long totalEmployees;
    private Long presentToday;
    private Long absentToday;
    private Long lateToday;
}
