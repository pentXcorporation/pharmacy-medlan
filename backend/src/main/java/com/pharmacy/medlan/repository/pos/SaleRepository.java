package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.Sale;
import com.pharmacy.medlan.enums.PaymentMethod;
import com.pharmacy.medlan.enums.SaleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long>, JpaSpecificationExecutor<Sale> {

    Optional<Sale> findBySaleNumber(String saleNumber);

    List<Sale> findByCustomerId(Long customerId);

    List<Sale> findByBranchId(Long branchId);

    List<Sale> findByStatus(SaleStatus status);

    List<Sale> findBySaleDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Sale> findByBranchIdAndStatus(Long branchId, SaleStatus status);

    List<Sale> findByCustomerIdAndStatus(Long customerId, SaleStatus status);

    @Query("SELECT s FROM Sale s WHERE s.branch.id = :branchId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM Sale s WHERE s.customer.id = :customerId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findByCustomerAndDateRange(
            @Param("customerId") Long customerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM Sale s WHERE s.soldBy.id = :userId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findBySoldByAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.branch.id = :branchId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate AND s.status = 'COMPLETED'")
    BigDecimal getTotalSalesByBranchAndDate(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(s.totalAmount - s.subtotal + s.discountAmount) FROM Sale s WHERE s.branch.id = :branchId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate AND s.status = 'COMPLETED'")
    BigDecimal getTotalProfitByBranchAndDate(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.customer.id = :customerId " +
            "AND s.status = 'COMPLETED'")
    BigDecimal getTotalSalesByCustomer(@Param("customerId") Long customerId);

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.branch.id = :branchId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate")
    Long countSalesByBranchAndDate(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.status = :status")
    Long countByStatus(@Param("status") SaleStatus status);

    @Query("SELECT s FROM Sale s WHERE s.status = 'PENDING' " +
            "AND s.branch.id = :branchId ORDER BY s.saleDate DESC")
    List<Sale> findPendingSalesByBranch(@Param("branchId") Long branchId);

    @Query("SELECT s FROM Sale s WHERE s.status = 'COMPLETED' " +
            "AND s.branch.id = :branchId " +
            "ORDER BY s.saleDate DESC")
    List<Sale> findRecentCompletedSales(@Param("branchId") Long branchId);

    @Query("SELECT AVG(s.totalAmount) FROM Sale s WHERE s.branch.id = :branchId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate AND s.status = 'COMPLETED'")
    BigDecimal getAverageTransactionValue(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    boolean existsBySaleNumber(String saleNumber);

    @Query("SELECT s FROM Sale s WHERE s.branch.id = :branchId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findByBranchIdAndSaleDateBetween(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM Sale s JOIN s.saleItems si " +
            "WHERE si.product.id = :productId AND s.branch.id = :branchId " +
            "AND s.status = 'COMPLETED' ORDER BY s.saleDate DESC")
    Optional<Sale> findLastSaleForProduct(
            @Param("productId") Long productId,
            @Param("branchId") Long branchId);
}