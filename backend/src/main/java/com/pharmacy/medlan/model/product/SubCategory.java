package com.pharmacy.medlan.model.product;

import com.pharmacy.medlan.model.base.AuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sub_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"category", "products"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class SubCategory extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "sub_category_name", nullable = false, length = 100)
    @NotBlank(message = "Sub-category name is required")
    private String subCategoryName;

    @Column(name = "sub_category_code", unique = true, length = 50)
    private String subCategoryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is required")
    private Category category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_code")
    private Integer minCode;

    @Column(name = "max_code")
    private Integer maxCode;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "subCategory")
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}