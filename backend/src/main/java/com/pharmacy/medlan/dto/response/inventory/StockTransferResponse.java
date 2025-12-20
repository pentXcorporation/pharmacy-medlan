package com.pharmacy.medlan.dto.response.inventory;

import com.pharmacy.medlan.enums.StockTransferStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransferResponse {

    private Long id;
    private String transferNumber;
    private Long fromBranchId;
    private String fromBranchName;
    private Long toBranchId;
    private String toBranchName;
    private LocalDate transferDate;
    private LocalDate expectedReceiptDate;
    private LocalDate actualReceiptDate;
    private StockTransferStatus status;
    private String initiatedByName;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String receivedByName;
    private String remarks;
    private List<StockTransferItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockTransferItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productSku;
        private Long inventoryBatchId;
        private String batchNumber;
        private Integer quantityTransferred;
        private Integer quantityReceived;
        private String remarks;
    }
}
