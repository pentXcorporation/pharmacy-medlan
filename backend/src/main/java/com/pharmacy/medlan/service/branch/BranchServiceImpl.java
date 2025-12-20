package com.pharmacy.medlan.service.branch;

import com.pharmacy.medlan.exception.DuplicationResourceException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    @Override
    @Transactional
    public Branch createBranch(Branch branch) {
        log.info("Creating branch: {}", branch.getBranchName());

        if (branchRepository.existsByBranchCode(branch.getBranchCode())) {
            throw new DuplicationResourceException("Branch code already exists: " + branch.getBranchCode());
        }

        if (branch.getEmail() != null && branchRepository.existsByEmail(branch.getEmail())) {
            throw new DuplicationResourceException("Email already exists: " + branch.getEmail());
        }

        branch.setIsActive(true);
        Branch saved = branchRepository.save(branch);
        log.info("Branch created with code: {}", saved.getBranchCode());
        return saved;
    }

    @Override
    @Transactional
    public Branch updateBranch(Long id, Branch branch) {
        log.info("Updating branch: {}", id);

        Branch existing = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        // Update fields
        if (branch.getBranchName() != null) {
            existing.setBranchName(branch.getBranchName());
        }
        if (branch.getAddress() != null) {
            existing.setAddress(branch.getAddress());
        }
        if (branch.getCity() != null) {
            existing.setCity(branch.getCity());
        }
        if (branch.getState() != null) {
            existing.setState(branch.getState());
        }
        if (branch.getPincode() != null) {
            existing.setPincode(branch.getPincode());
        }
        if (branch.getPhoneNumber() != null) {
            existing.setPhoneNumber(branch.getPhoneNumber());
        }
        if (branch.getEmail() != null) {
            existing.setEmail(branch.getEmail());
        }
        if (branch.getGstinNumber() != null) {
            existing.setGstinNumber(branch.getGstinNumber());
        }
        if (branch.getDrugLicenseNumber() != null) {
            existing.setDrugLicenseNumber(branch.getDrugLicenseNumber());
        }
        if (branch.getManager() != null) {
            existing.setManager(branch.getManager());
        }

        return branchRepository.save(existing);
    }

    @Override
    public Optional<Branch> getBranchById(Long id) {
        return branchRepository.findById(id);
    }

    @Override
    public Branch getBranchByCode(String branchCode) {
        return branchRepository.findByBranchCode(branchCode)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with code: " + branchCode));
    }

    @Override
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public Page<Branch> getAllBranches(Pageable pageable) {
        return branchRepository.findAll(pageable);
    }

    @Override
    public List<Branch> getActiveBranches() {
        return branchRepository.findByIsActiveTrue();
    }

    @Override
    @Transactional
    public void deleteBranch(Long id) {
        log.info("Deleting branch: {}", id);

        if (!branchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Branch not found with id: " + id);
        }

        branchRepository.deleteById(id);
        log.info("Branch deleted: {}", id);
    }

    @Override
    @Transactional
    public void softDeleteBranch(Long id) {
        log.info("Soft deleting branch: {}", id);

        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        branch.setDeleted(true);
        branch.setIsActive(false);
        branchRepository.save(branch);
        log.info("Branch soft deleted: {}", id);
    }

    @Override
    @Transactional
    public void activateBranch(Long id) {
        log.info("Activating branch: {}", id);

        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        branch.setIsActive(true);
        branchRepository.save(branch);
        log.info("Branch activated: {}", id);
    }

    @Override
    @Transactional
    public void deactivateBranch(Long id) {
        log.info("Deactivating branch: {}", id);

        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        branch.setIsActive(false);
        branchRepository.save(branch);
        log.info("Branch deactivated: {}", id);
    }

    @Override
    public List<Branch> searchBranches(String search) {
        return branchRepository.searchBranches(search);
    }

    @Override
    public List<Branch> getBranchesByCity(String city) {
        return branchRepository.findByCity(city);
    }

    @Override
    public List<Branch> getBranchesByState(String state) {
        return branchRepository.findByState(state);
    }

    @Override
    public boolean existsByBranchCode(String branchCode) {
        return branchRepository.existsByBranchCode(branchCode);
    }

    @Override
    public boolean existsByEmail(String email) {
        return branchRepository.existsByEmail(email);
    }

    @Override
    public Branch getMainBranch() {
        return branchRepository.findByIsMainBranchTrue()
                .orElseThrow(() -> new ResourceNotFoundException("No main branch configured"));
    }

    @Override
    @Transactional
    public void setAsMainBranch(Long id) {
        log.info("Setting branch {} as main branch", id);

        Branch newMainBranch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        // Remove main branch flag from current main branch
        branchRepository.findByIsMainBranchTrue().ifPresent(currentMain -> {
            currentMain.setIsMainBranch(false);
            branchRepository.save(currentMain);
        });

        // Set new main branch
        newMainBranch.setIsMainBranch(true);
        branchRepository.save(newMainBranch);
        log.info("Branch {} is now the main branch", id);
    }

    @Override
    public long countActiveBranches() {
        return branchRepository.countActiveBranches();
    }

    @Override
    public long countTotalBranches() {
        return branchRepository.count();
    }
}
