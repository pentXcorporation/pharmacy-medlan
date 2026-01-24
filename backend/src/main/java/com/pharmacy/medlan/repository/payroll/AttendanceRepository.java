package com.pharmacy.medlan.repository.payroll;

import com.pharmacy.medlan.enums.AttendanceStatus;
import com.pharmacy.medlan.model.payroll.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("SELECT a FROM Attendance a WHERE " +
           "(:search IS NULL OR LOWER(a.employee.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.employee.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:date IS NULL OR a.date = :date) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "a.deleted = false")
    Page<Attendance> searchAttendance(@Param("search") String search,
                                      @Param("date") LocalDate date,
                                      @Param("status") AttendanceStatus status,
                                      Pageable pageable);

    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    List<Attendance> findByDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = :status AND a.deleted = false")
    Long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") AttendanceStatus status);

    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.date BETWEEN :startDate AND :endDate AND a.deleted = false")
    List<Attendance> findByEmployeeAndDateRange(@Param("employeeId") Long employeeId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);
}
