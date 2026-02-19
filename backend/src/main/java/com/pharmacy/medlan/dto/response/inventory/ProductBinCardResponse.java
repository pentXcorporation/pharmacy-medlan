package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.TransactionType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductBinCardResponse {

    private Long productId;
    private String productCode;
    private String productName;
    private String genericName;
    private Long branchId;
    private String branchName;

    private Integer openingBalance;
    private Integer closingBalance;
    private BigDecimal openingValue;
    private BigDecimal closingValue;

    private List<BinCardEntry> entries;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BinCardEntry {
        private Long id;
        private LocalDateTime transactionDate;
        private TransactionType transactionType;
        private String transactionNumber;
        private String reference;
        private String batchNumber;
        private Integer quantityIn;
        private Integer quantityOut;
        private Integer runningBalance;
        private BigDecimal unitPrice;
        private BigDecimal transactionValue;
        private String remarks;
        private String createdBy;
    }
}