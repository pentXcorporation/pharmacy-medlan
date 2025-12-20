package com.pharmacy.medlan.service.branch;

import com.pharmacy.medlan.model.organization.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface BranchService {

    // CRUD Operations
    Branch createBranch(Branch branch);

    Branch updateBranch(Long id, Branch branch);

    Optional<Branch> getBranchById(Long id);

    Branch getBranchByCode(String branchCode);

    List<Branch> getAllBranches();

    Page<Branch> getAllBranches(Pageable pageable);

    List<Branch> getActiveBranches();

    void deleteBranch(Long id);

    void softDeleteBranch(Long id);

    // Status Management
    void activateBranch(Long id);

    void deactivateBranch(Long id);

    // Search Operations
    List<Branch> searchBranches(String search);

    List<Branch> getBranchesByCity(String city);

    List<Branch> getBranchesByState(String state);

    // Validation
    boolean existsByBranchCode(String branchCode);

    boolean existsByEmail(String email);

    // Main Branch Operations
    Branch getMainBranch();

    void setAsMainBranch(Long id);

    // Count Operations
    long countActiveBranches();

    long countTotalBranches();
}
