package com.pharmacy.medlan.model.inventory;

import com.pharmacy.medlan.model.base.BaseEntity;
import com.pharmacy.medlan.model.product.Product;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expiry_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpiryData extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_code", length = 50)
    private String productCode;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "batch_price", precision = 10, scale = 2)
    private BigDecimal batchPrice;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "found_date")
    private LocalDate foundDate;

    @Column(name = "company", length = 200)
    private String company;
}
