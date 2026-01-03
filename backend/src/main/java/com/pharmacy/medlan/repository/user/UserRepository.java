package com.pharmacy.medlan.repository.user;

import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeCode(String employeeCode);
    List<User> findByRole(Role role);
    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u JOIN u.branchAssignments bs WHERE bs.branch.id = :branchId")
    List<User> findUsersByBranch(@Param("branchId") Long branchId);
    
    /**
     * Find users by branch ID
     */
    @Query("SELECT u FROM User u JOIN u.branchAssignments ba WHERE ba.branch.id = :branchId AND u.isActive = true")
    List<User> findByBranchId(@Param("branchId") Long branchId);
    
    /**
     * Find users by branch ID and role
     */
    @Query("SELECT u FROM User u JOIN u.branchAssignments ba " +
           "WHERE ba.branch.id = :branchId AND u.role = :role AND u.isActive = true")
    List<User> findByBranchIdAndRole(@Param("branchId") Long branchId, @Param("role") String role);
    
    /**
     * Find users by branch ID and role enum
     */
    @Query("SELECT u FROM User u JOIN u.branchAssignments ba " +
           "WHERE ba.branch.id = :branchId AND u.role = :role AND u.isActive = true")
    List<User> findByBranchIdAndRoleEnum(@Param("branchId") Long branchId, @Param("role") Role role);
    
    /**
     * Find all managers
     */
    @Query("SELECT u FROM User u WHERE u.role IN ('ADMIN', 'OWNER', 'MANAGER') AND u.isActive = true")
    List<User> findAllManagers();
    
    /**
     * Count users by role
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true")
    Long countByRole(@Param("role") Role role);
    
    /**
     * Find users by branch and multiple roles (for notifications)
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.branchAssignments ba " +
           "WHERE ba.branch.id = :branchId AND u.role IN :roles AND u.isActive = true")
    List<User> findByBranchIdAndRoleIn(@Param("branchId") Long branchId, @Param("roles") List<String> roles);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
}
