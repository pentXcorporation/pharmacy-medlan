package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bank_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankData extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "credit_amount", precision = 12, scale = 2)
    private BigDecimal creditAmount = BigDecimal.ZERO;

    @Column(name = "debit_amount", precision = 12, scale = 2)
    private BigDecimal debitAmount = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "cheque_number", length = 100)
    private String chequeNumber;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "actual_date")
    private LocalDate actualDate;

    @Column(name = "description", length = 500)
    private String description;
}
