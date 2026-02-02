package com.pharmacy.medlan.dto.response.attendance;

import com.pharmacy.medlan.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Long id;
    private Long branchId;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private Double workHours;
    private AttendanceStatus status;
    private String notes;
    private Boolean isApproved;
    private String approvedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
