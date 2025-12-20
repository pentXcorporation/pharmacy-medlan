package com.pharmacy.medlan.model.report;

import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.organization.Branch;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_sales_summaries", indexes = {
        @Index(name = "idx_summary_date", columnList = "summary_date"),
        @Index(name = "idx_summary_branch", columnList = "branch_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailySalesSummary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "summary_date", nullable = false)
    private LocalDate summaryDate;

    @Column(name = "total_sales_count", nullable = false)
    private Integer totalSalesCount = 0;

    @Column(name = "total_sales_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalSalesAmount = BigDecimal.ZERO;

    @Column(name = "total_cost", precision = 15, scale = 2)
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(name = "total_profit", precision = 15, scale = 2)
    private BigDecimal totalProfit = BigDecimal.ZERO;

    @Column(name = "total_discount", precision = 12, scale = 2)
    private BigDecimal totalDiscount = BigDecimal.ZERO;

    @Column(name = "cash_sales", precision = 12, scale = 2)
    private BigDecimal cashSales = BigDecimal.ZERO;

    @Column(name = "card_sales", precision = 12, scale = 2)
    private BigDecimal cardSales = BigDecimal.ZERO;

    @Column(name = "credit_sales", precision = 12, scale = 2)
    private BigDecimal creditSales = BigDecimal.ZERO;
}
