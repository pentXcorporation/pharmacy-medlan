package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.enums.StockTransferStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_transfers", indexes = {
        @Index(name = "idx_transfer_number", columnList = "transfer_number"),
        @Index(name = "idx_transfer_status", columnList = "status"),
        @Index(name = "idx_transfer_from", columnList = "from_branch_id"),
        @Index(name = "idx_transfer_to", columnList = "to_branch_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"fromBranch", "toBranch", "initiatedBy", "approvedBy", "receivedBy", "items"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class StockTransfer extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "transfer_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Transfer number is required")
    @EqualsAndHashCode.Include
    private String transferNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_branch_id", nullable = false)
    @NotNull(message = "From branch is required")
    private Branch fromBranch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_branch_id", nullable = false)
    @NotNull(message = "To branch is required")
    private Branch toBranch;

    @Column(name = "transfer_date", nullable = false)
    @NotNull(message = "Transfer date is required")
    private LocalDate transferDate;

    @Column(name = "expected_receipt_date")
    private LocalDate expectedReceiptDate;

    @Column(name = "actual_receipt_date")
    private LocalDate actualReceiptDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private StockTransferStatus status = StockTransferStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiated_by_user_id")
    private User initiatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by_user_id")
    private User receivedBy;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "stockTransfer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StockTransferItem> items = new ArrayList<>();

    public boolean isApproved() {
        return status == StockTransferStatus.APPROVED;
    }

    public boolean isCompleted() {
        return status == StockTransferStatus.COMPLETED;
    }
}