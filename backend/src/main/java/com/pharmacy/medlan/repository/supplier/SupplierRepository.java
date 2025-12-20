package com.pharmacy.medlan.repository.supplier;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.model.supplier.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long>, JpaSpecificationExecutor<Supplier> {

    Optional<Supplier> findBySupplierCode(String supplierCode);

    Optional<Supplier> findBySupplierName(String supplierName);

    Optional<Supplier> findByEmail(String email);

    Optional<Supplier> findByGstinNumber(String gstinNumber);

    Optional<Supplier> findByDrugLicenseNumber(String drugLicenseNumber);

    List<Supplier> findByIsActiveTrue();

    List<Supplier> findByIsActiveFalse();

    List<Supplier> findByCity(String city);

    List<Supplier> findByState(String state);

    @Query("SELECT s FROM Supplier s WHERE " +
            "(LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.supplierCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.contactPerson) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Supplier> searchSuppliers(@Param("search") String search);

    @Query("SELECT s FROM Supplier s WHERE s.isActive = true AND " +
            "s.currentBalance > 0 ORDER BY s.currentBalance DESC")
    List<Supplier> findSuppliersWithOutstandingBalance();

    @Query("SELECT s FROM Supplier s WHERE s.isActive = true AND " +
            "s.currentBalance >= s.creditLimit")
    List<Supplier> findSuppliersExceedingCreditLimit();

    @Query("SELECT SUM(s.currentBalance) FROM Supplier s WHERE s.isActive = true")
    BigDecimal getTotalOutstandingBalance();

    @Query("SELECT COUNT(s) FROM Supplier s WHERE s.isActive = true")
    Long countActiveSuppliers();

    boolean existsBySupplierCode(String supplierCode);

    boolean existsByEmail(String email);

    boolean existsByGstinNumber(String gstinNumber);

    boolean existsByDrugLicenseNumber(String drugLicenseNumber);
}
