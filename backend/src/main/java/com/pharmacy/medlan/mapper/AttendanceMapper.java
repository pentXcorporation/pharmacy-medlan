package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.attendance.AttendanceRequest;
import com.pharmacy.medlan.dto.response.attendance.AttendanceResponse;
import com.pharmacy.medlan.model.payroll.Attendance;
import com.pharmacy.medlan.model.payroll.Employee;
import com.pharmacy.medlan.model.organization.Branch;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class AttendanceMapper {

    public Attendance toEntity(AttendanceRequest request, Employee employee, Branch branch) {
        Attendance attendance = Attendance.builder()
                .employee(employee)
                .branch(branch)
                .date(request.getDate())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .status(request.getStatus())
                .notes(request.getNotes())
                .isApproved(false)
                .build();

        // Calculate work hours if both check-in and check-out are provided
        if (request.getCheckIn() != null && request.getCheckOut() != null) {
            Duration duration = Duration.between(request.getCheckIn(), request.getCheckOut());
            attendance.setWorkHours(duration.toMinutes() / 60.0);
        }

        return attendance;
    }

    public AttendanceResponse toResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .branchId(attendance.getBranch() != null ? attendance.getBranch().getId() : null)
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getFullName())
                .employeeCode(attendance.getEmployee().getEmployeeCode())
                .date(attendance.getDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .workHours(attendance.getWorkHours())
                .status(attendance.getStatus())
                .notes(attendance.getNotes())
                .isApproved(attendance.getIsApproved())
                .approvedBy(attendance.getApprovedBy())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }

    public void updateEntity(Attendance attendance, AttendanceRequest request, Branch branch) {
        attendance.setBranch(branch);
        attendance.setDate(request.getDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());
        attendance.setNotes(request.getNotes());

        // Recalculate work hours
        if (request.getCheckIn() != null && request.getCheckOut() != null) {
            Duration duration = Duration.between(request.getCheckIn(), request.getCheckOut());
            attendance.setWorkHours(duration.toMinutes() / 60.0);
        } else {
            attendance.setWorkHours(null);
        }
    }
}
