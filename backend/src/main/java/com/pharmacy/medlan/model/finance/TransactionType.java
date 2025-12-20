package com.pharmacy.medlan.model.finance;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaction_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionType extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false, unique = true, length = 100)
    private String typeName;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "is_income", nullable = false)
    private Boolean isIncome; // true = Income, false = Expense

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
