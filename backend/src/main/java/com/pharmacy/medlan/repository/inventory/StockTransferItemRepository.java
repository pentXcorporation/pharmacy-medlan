package com.pharmacy.medlan.repository.inventory;

import com.pharmacy.medlan.model.inventory.StockTransferItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockTransferItemRepository extends JpaRepository<StockTransferItem, Long> {
    List<StockTransferItem> findByStockTransferId(Long stockTransferId);
    List<StockTransferItem> findByProductId(Long productId);
}
