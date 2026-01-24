package com.pharmacy.medlan.dto.request.attendance;

import com.pharmacy.medlan.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime checkIn;

    private LocalTime checkOut;

    @NotNull(message = "Status is required")
    private AttendanceStatus status;

    private String notes;
}
