package com.pharmacy.medlan.service.attendance;

import com.pharmacy.medlan.dto.request.attendance.AttendanceRequest;
import com.pharmacy.medlan.dto.response.attendance.AttendanceResponse;
import com.pharmacy.medlan.dto.response.attendance.AttendanceStatsResponse;
import com.pharmacy.medlan.enums.AttendanceStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.AttendanceMapper;
import com.pharmacy.medlan.model.payroll.Attendance;
import com.pharmacy.medlan.model.payroll.Employee;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.repository.payroll.AttendanceRepository;
import com.pharmacy.medlan.repository.payroll.EmployeeRepository;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceMapper attendanceMapper;
    private final BranchRepository branchRepository;

    /**
     * Validates that the branch exists and is active
     */
    private Branch validateBranch(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));
        
        if (!branch.getIsActive()) {
            throw new IllegalStateException("Branch with id " + branchId + " is not active");
        }
        
        return branch;
    }

    @Override
    @Transactional
    public AttendanceResponse createAttendance(AttendanceRequest request) {
        log.info("Creating attendance record for employee {} on {} at branch {}", 
                request.getEmployeeId(), request.getDate(), request.getBranchId());

        // Validate branch
        Branch branch = validateBranch(request.getBranchId());

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        // Check if attendance already exists for this employee on this date
        attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), request.getDate())
                .ifPresent(existing -> {
                    throw new IllegalStateException("Attendance already marked for this employee on " + request.getDate());
                });

        Attendance attendance = attendanceMapper.toEntity(request, employee, branch);
        Attendance saved = attendanceRepository.save(attendance);

        log.info("Attendance record created with id: {}", saved.getId());
        return attendanceMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        log.info("Updating attendance record with id: {}", id);

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));

        // Validate branch
        Branch branch = validateBranch(request.getBranchId());

        // If employee is being changed, verify the new employee exists
        if (!attendance.getEmployee().getId().equals(request.getEmployeeId())) {
            Employee newEmployee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));
            attendance.setEmployee(newEmployee);
        }

        attendanceMapper.updateEntity(attendance, request, branch);
        Attendance updated = attendanceRepository.save(attendance);

        log.info("Attendance record updated successfully");
        return attendanceMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        log.info("Deleting attendance record with id: {}", id);

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));

        attendance.setDeleted(true);
        attendanceRepository.save(attendance);

        log.info("Attendance record deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(Long id) {
        log.info("Fetching attendance record with id: {}", id);

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponse> searchAttendance(String search, LocalDate date, AttendanceStatus status, Pageable pageable) {
        log.info("Searching attendance records with search={}, date={}, status={}", search, date, status);

        Page<Attendance> attendancePage = attendanceRepository.searchAttendance(search, date, status, pageable);

        return attendancePage.map(attendanceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceStatsResponse getTodayStats() {
        LocalDate today = LocalDate.now();
        log.info("Fetching attendance stats for {}", today);

        Long totalEmployees = employeeRepository.count();
        Long presentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.PRESENT);
        Long absentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.ABSENT);
        Long lateToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.LATE);

        return AttendanceStatsResponse.builder()
                .totalEmployees(totalEmployees)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .lateToday(lateToday)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getEmployeeAttendanceByDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching attendance for employee {} between {} and {}", employeeId, startDate, endDate);

        // Verify employee exists
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        List<Attendance> attendanceList = attendanceRepository.findByEmployeeAndDateRange(employeeId, startDate, endDate);

        return attendanceList.stream()
                .map(attendanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceResponse approveAttendance(Long id, String approvedBy) {
        log.info("Approving attendance record with id: {} by {}", id, approvedBy);

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));

        attendance.setIsApproved(true);
        attendance.setApprovedBy(approvedBy);

        Attendance updated = attendanceRepository.save(attendance);

        log.info("Attendance record approved successfully");
        return attendanceMapper.toResponse(updated);
    }
}
