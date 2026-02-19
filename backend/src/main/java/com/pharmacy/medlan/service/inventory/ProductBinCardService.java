package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.enums.TransactionType;
import com.pharmacy.medlan.model.inventory.ProductBinCard;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductBinCardService {

    ProductBinCard recordTransaction(Long productId, Long branchId, TransactionType transactionType,
                                     Long referenceId, String referenceNumber,
                                     int quantityIn, int quantityOut, String description);

    List<ProductBinCard> getBinCardByProduct(Long productId);

    List<ProductBinCard> getBinCardByProductAndBranch(Long productId, Long branchId);

    List<ProductBinCard> getBinCardByProductBranchAndDateRange(Long productId, Long branchId,
                                                               LocalDateTime startDate, LocalDateTime endDate);

    List<ProductBinCard> getBinCardByBranch(Long branchId);

    List<ProductBinCard> getBinCardByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    int getRunningBalance(Long productId, Long branchId);
}
