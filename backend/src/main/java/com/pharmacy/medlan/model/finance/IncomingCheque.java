package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.enums.ChequeStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.pos.Customer;
import com.pharmacy.medlan.model.supplier.Supplier;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "incoming_cheques", indexes = {
        @Index(name = "idx_cheque_number", columnList = "cheque_number"),
        @Index(name = "idx_cheque_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingCheque extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cheque_number", nullable = false, unique = true, length = 100)
    private String chequeNumber;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "cheque_date", nullable = false)
    private LocalDate chequeDate;

    @Column(name = "deposit_date", nullable = false)
    private LocalDate depositDate;

    @Column(name = "clearance_date")
    private LocalDate clearanceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "received_from", length = 200)
    private String receivedFrom;

    @Column(name = "company", length = 200)
    private String company;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ChequeStatus status = ChequeStatus.PENDING;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}