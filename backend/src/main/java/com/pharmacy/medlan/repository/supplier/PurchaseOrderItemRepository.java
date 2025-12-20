package com.pharmacy.medlan.repository.supplier;

import com.pharmacy.medlan.model.supplier.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, Long> {

    List<PurchaseOrderItem> findByPurchaseOrderId(Long purchaseOrderId);

    List<PurchaseOrderItem> findByProductId(Long productId);

    Optional<PurchaseOrderItem> findByPurchaseOrderIdAndProductId(Long purchaseOrderId, Long productId);

    @Query("SELECT poi FROM PurchaseOrderItem poi WHERE poi.purchaseOrder.id = :purchaseOrderId " +
            "AND poi.quantityOrdered > poi.quantityReceived")
    List<PurchaseOrderItem> findPendingReceiptItems(@Param("purchaseOrderId") Long purchaseOrderId);

    @Query("SELECT SUM(poi.totalAmount) FROM PurchaseOrderItem poi " +
            "WHERE poi.purchaseOrder.id = :purchaseOrderId")
    BigDecimal getTotalAmountByPurchaseOrder(@Param("purchaseOrderId") Long purchaseOrderId);

    @Query("SELECT SUM(poi.quantityOrdered) FROM PurchaseOrderItem poi " +
            "WHERE poi.product.id = :productId " +
            "AND poi.purchaseOrder.status = 'APPROVED'")
    Integer getTotalOrderedQuantityByProduct(@Param("productId") Long productId);

    @Query("SELECT poi FROM PurchaseOrderItem poi " +
            "WHERE poi.purchaseOrder.supplier.id = :supplierId " +
            "AND poi.purchaseOrder.status = 'APPROVED' " +
            "AND poi.quantityOrdered > poi.quantityReceived")
    List<PurchaseOrderItem> findPendingItemsBySupplier(@Param("supplierId") Long supplierId);

    @Query("SELECT SUM(poi.quantityOrdered - poi.quantityReceived) FROM PurchaseOrderItem poi " +
            "WHERE poi.product.id = :productId " +
            "AND poi.purchaseOrder.status IN ('APPROVED', 'PARTIALLY_RECEIVED')")
    Integer getPendingQuantityByProduct(@Param("productId") Long productId);
}
