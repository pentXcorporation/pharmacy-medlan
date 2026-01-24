package com.pharmacy.medlan.service.attendance;

import com.pharmacy.medlan.dto.request.attendance.AttendanceRequest;
import com.pharmacy.medlan.dto.response.attendance.AttendanceResponse;
import com.pharmacy.medlan.dto.response.attendance.AttendanceStatsResponse;
import com.pharmacy.medlan.enums.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    
    AttendanceResponse createAttendance(AttendanceRequest request);
    
    AttendanceResponse updateAttendance(Long id, AttendanceRequest request);
    
    void deleteAttendance(Long id);
    
    AttendanceResponse getAttendanceById(Long id);
    
    Page<AttendanceResponse> searchAttendance(String search, LocalDate date, AttendanceStatus status, Pageable pageable);
    
    AttendanceStatsResponse getTodayStats();
    
    List<AttendanceResponse> getEmployeeAttendanceByDateRange(Long employeeId, LocalDate startDate, LocalDate endDate);
    
    AttendanceResponse approveAttendance(Long id, String approvedBy);
}
