package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.enums.CashRegisterTransactionType;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Cash Register Transaction Entity
 * Records individual cash in/out transactions during the day
 */
@Entity
@Table(name = "cash_register_transactions", indexes = {
        @Index(name = "idx_register_trans_register", columnList = "cash_register_id"),
        @Index(name = "idx_register_trans_type", columnList = "type"),
        @Index(name = "idx_register_trans_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashRegisterTransaction extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cash_register_id", nullable = false)
    private CashRegister cashRegister;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private CashRegisterTransactionType type;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "category", length = 100)
    private String category;

    // Link to CashBook entry if this transaction was recorded there
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cash_book_id")
    private CashBook cashBookEntry;
}
