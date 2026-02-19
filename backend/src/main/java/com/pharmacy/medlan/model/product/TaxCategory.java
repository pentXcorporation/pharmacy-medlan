package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tax_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class TaxCategory extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "tax_name", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Tax name is required")
    @EqualsAndHashCode.Include
    private String taxName;

    @Column(name = "tax_rate", nullable = false, precision = 5, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", message = "Tax rate must be non-negative")
    @DecimalMax(value = "100.0", message = "Tax rate cannot exceed 100%")
    private BigDecimal taxRate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}