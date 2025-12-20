package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.product.Product;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "grn_temp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GRNTemp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(name = "batch_number", length = 100)
    private String batchNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "grn_number", length = 50)
    private String grnNumber;

    @Column(name = "status")
    private Integer status = 0; // 0 = Pending, 1 = Processed
}