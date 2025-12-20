package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rgrns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RGRN extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rgrn_number", nullable = false, unique = true, length = 50)
    private String rgrnNumber; // RGRN-2024-00001

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_grn_id")
    private GRN originalGrn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "return_date", nullable = false)
    private LocalDate returnDate;

    @Column(name = "total_return_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalReturnAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_status", nullable = false, length = 50)
    private PaymentStatus refundStatus = PaymentStatus.PENDING;

    @Column(name = "return_reason", columnDefinition = "TEXT")
    private String returnReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "returned_by_user_id")
    private User returnedBy;

    @OneToMany(mappedBy = "rgrn", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RGRNLine> rgrnLines = new ArrayList<>();

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}