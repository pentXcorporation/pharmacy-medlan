package com.pharmacy.medlan.model.payroll;

import com.pharmacy.medlan.enums.AttendanceStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

@Entity
@Table(name = "attendance", indexes = {
        @Index(name = "idx_attendance_employee", columnList = "employee_id"),
        @Index(name = "idx_attendance_date", columnList = "date"),
        @Index(name = "idx_attendance_branch", columnList = "branch_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"employee", "branch"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Attendance extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull(message = "Employee is required")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(nullable = false)
    @NotNull(message = "Date is required")
    private LocalDate date;

    @Column(name = "check_in")
    private LocalTime checkIn;

    @Column(name = "check_out")
    private LocalTime checkOut;

    @Column(name = "work_hours")
    private Double workHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    @Column(length = 500)
    private String notes;

    @Column(name = "is_approved")
    @Builder.Default
    private Boolean isApproved = false;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    public void calculateWorkHours() {
        if (checkIn != null && checkOut != null) {
            Duration duration = Duration.between(checkIn, checkOut);
            this.workHours = duration.toMinutes() / 60.0;
        }
    }

    public boolean isFullDay() {
        return workHours != null && workHours >= 8.0;
    }
}