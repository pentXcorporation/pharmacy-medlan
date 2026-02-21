package com.pharmacy.medlan.repository.organization;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pharmacy.medlan.model.organization.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long>, JpaSpecificationExecutor<Branch> {

    Optional<Branch> findByBranchCode(String branchCode);

    Optional<Branch> findByBranchName(String branchName);

    List<Branch> findByIsActiveTrue();

    List<Branch> findByIsActiveFalse();

    Optional<Branch> findByIsMainBranchTrue();

    List<Branch> findByCity(String city);

    List<Branch> findByState(String state);

    Optional<Branch> findByManagerId(Long managerId);

    @Query("SELECT b FROM Branch b WHERE " +
            "(LOWER(b.branchName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.branchCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.city) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Branch> searchBranches(@Param("search") String search);

    @Query("SELECT bs.branch FROM BranchStaff bs WHERE bs.user.id = :userId")
    List<Branch> findBranchesByStaffUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(b) FROM Branch b WHERE b.isActive = true")
    Long countActiveBranches();

    @Query("SELECT b FROM Branch b WHERE b.drugLicenseNumber IS NOT NULL")
    List<Branch> findBranchesWithDrugLicense();

    @Query("SELECT b FROM Branch b WHERE b.gstinNumber IS NOT NULL")
    List<Branch> findBranchesWithGSTIN();

    boolean existsByBranchCode(String branchCode);

    boolean existsByBranchName(String branchName);

    boolean existsByEmail(String email);

    boolean existsByGstinNumber(String gstinNumber);

    boolean existsByDrugLicenseNumber(String drugLicenseNumber);
    
    /**
     * Find all active branches
     */
    @Query("SELECT b FROM Branch b WHERE b.isActive = true ORDER BY b.branchName")
    List<Branch> findAllActive();
    
    /**
     * Find branches by IDs
     */
    @Query("SELECT b FROM Branch b WHERE b.id IN :ids")
    List<Branch> findByIds(@Param("ids") List<Long> ids);
}