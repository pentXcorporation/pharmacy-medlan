package com.pharmacy.medlan.model.pos;

import com.pharmacy.medlan.enums.InvoiceStatus;
import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices", indexes = {
        @Index(name = "idx_invoice_number", columnList = "invoice_number"),
        @Index(name = "idx_invoice_date", columnList = "invoice_date"),
        @Index(name = "idx_invoice_customer", columnList = "customer_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"customer", "branch", "user", "sale"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Invoice extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Invoice number is required")
    @EqualsAndHashCode.Include
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    @NotNull(message = "Branch is required")
    private Branch branch;

    @Column(name = "invoice_date", nullable = false)
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "subtotal", precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 50)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", length = 50)
    private PaymentMethod paymentType;

    @Column(name = "cheque_number", length = 100)
    private String chequeNumber;

    @Column(name = "cheque_date")
    private LocalDate chequeDate;

    @Column(name = "card_details", length = 100)
    private String cardDetails;

    @Column(name = "doctor_name", length = 200)
    private String doctorName;

    @Column(name = "patient_number", length = 100)
    private String patientNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "cashier_user_id")
    private Integer cashierUserId;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @OneToOne(mappedBy = "invoice", cascade = CascadeType.ALL)
    private Sale sale;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public boolean isPaid() {
        return paymentStatus == PaymentStatus.PAID;
    }

    public boolean isOverdue() {
        return dueDate != null && LocalDate.now().isAfter(dueDate) &&
                paymentStatus != PaymentStatus.PAID;
    }
}