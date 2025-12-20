package com.pharmacy.medlan.repository.inventory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.model.inventory.RGRNLine;

@Repository
public interface RGRNLineRepository extends JpaRepository<RGRNLine, Long> {

    List<RGRNLine> findByRgrnId(Long rgrnId);

    List<RGRNLine> findByProductId(Long productId);

    Optional<RGRNLine> findByRgrnIdAndProductIdAndBatchNumber(Long rgrnId, Long productId, String batchNumber);

    @Query("SELECT rl FROM RGRNLine rl WHERE rl.product.id = :productId " +
            "AND rl.batchNumber = :batchNumber")
    List<RGRNLine> findByProductAndBatch(
            @Param("productId") Long productId,
            @Param("batchNumber") String batchNumber);

    @Query("SELECT SUM(rl.totalAmount) FROM RGRNLine rl WHERE rl.rgrn.id = :rgrnId")
    BigDecimal getTotalAmountByRgrn(@Param("rgrnId") Long rgrnId);

    @Query("SELECT SUM(rl.quantityReturned) FROM RGRNLine rl WHERE rl.product.id = :productId")
    Integer getTotalReturnedQuantityByProduct(@Param("productId") Long productId);

    @Query("SELECT rl FROM RGRNLine rl WHERE rl.rgrn.supplier.id = :supplierId")
    List<RGRNLine> findBySupplier(@Param("supplierId") Long supplierId);
}
