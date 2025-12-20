package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.enums.TransactionType;
import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_bin_cards", indexes = {
        @Index(name = "idx_bincard_product", columnList = "product_id"),
        @Index(name = "idx_bincard_branch", columnList = "branch_id"),
        @Index(name = "idx_bincard_date", columnList = "transaction_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductBinCard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 50)
    private TransactionType transactionType;

    @Column(name = "reference_id")
    private Long referenceId; // GRN ID, Sale ID, Transfer ID, etc.

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "quantity_in", nullable = false)
    private Integer quantityIn = 0;

    @Column(name = "quantity_out", nullable = false)
    private Integer quantityOut = 0;

    @Column(name = "running_balance", nullable = false)
    private Integer runningBalance;

    @Column(name = "description", length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}