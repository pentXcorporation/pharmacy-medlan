package com.pharmacy.medlan.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String categoryName;
    private String categoryCode;
    private String description;
    private Integer minCode;
    private Integer maxCode;
    private Boolean isActive;
    private Integer subCategoryCount;
    private Integer productCount;
    private List<SubCategoryResponse> subCategories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
