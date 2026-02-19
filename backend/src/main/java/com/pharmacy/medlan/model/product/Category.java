package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"subCategories", "products"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Category extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Category name is required")
    @EqualsAndHashCode.Include
    private String categoryName;

    @Column(name = "category_code", unique = true, length = 50)
    private String categoryCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_code")
    private Integer minCode;

    @Column(name = "max_code")
    private Integer maxCode;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}