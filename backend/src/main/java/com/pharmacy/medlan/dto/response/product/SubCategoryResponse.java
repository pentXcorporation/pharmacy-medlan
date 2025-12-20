package com.pharmacy.medlan.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryResponse {

    private Long id;
    private String subCategoryName;
    private String subCategoryCode;
    private String description;
    private Integer minCode;
    private Integer maxCode;
    private Boolean isActive;
    private Long categoryId;
    private String categoryName;
    private Integer productCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
