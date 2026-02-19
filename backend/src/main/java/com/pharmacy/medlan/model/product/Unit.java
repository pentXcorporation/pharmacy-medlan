package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Unit extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "unit_name", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Unit name is required")
    @EqualsAndHashCode.Include
    private String unitName;

    @Column(name = "unit_code", unique = true, length = 20)
    private String unitCode;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}