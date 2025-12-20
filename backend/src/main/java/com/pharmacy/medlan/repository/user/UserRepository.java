package com.pharmacy.medlan.repository.user;

import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    List<User> findUsersByBranch(Long branchId);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
}
