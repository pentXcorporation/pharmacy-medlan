package com.pharmacy.medlan.model.pos;

import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer_prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerPrescription extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(name = "direction", length = 500)
    private String direction;

    @Column(name = "duration", length = 100)
    private String duration;

    @Column(name = "dosage", length = 100)
    private String dosage;

    @Column(name = "frequency", length = 200)
    private String frequency;

    @Column(name = "quantity_prescribed")
    private Integer quantityPrescribed;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;
}