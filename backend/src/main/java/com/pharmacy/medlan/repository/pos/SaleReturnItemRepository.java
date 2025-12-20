package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.SaleReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SaleReturnItemRepository extends JpaRepository<SaleReturnItem, Long> {
    List<SaleReturnItem> findBySaleReturnId(Long saleReturnId);
}