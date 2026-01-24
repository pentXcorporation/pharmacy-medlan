package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.dto.request.user.CreateUserRequest;
import com.pharmacy.medlan.dto.request.user.UpdateUserRequest;
import com.pharmacy.medlan.dto.response.user.UserResponse;
import com.pharmacy.medlan.enums.Role;
import com.pharmacy.medlan.exception.DuplicationResourceException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.UserMapper;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.user.BranchStaff;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.user.BranchStaffRepository;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final BranchRepository branchRepository;
    private final BranchStaffRepository branchStaffRepository;

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating user: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicationResourceException("Username already exists");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicationResourceException("Email already exists");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        log.info("User created: {}", saved.getUsername());

        // Assign branch to user if branchId is provided and role is not SUPER_ADMIN
        if (request.getBranchId() != null && request.getRole() != Role.SUPER_ADMIN) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

            BranchStaff branchStaff = BranchStaff.builder()
                    .user(saved)
                    .branch(branch)
                    .isPrimaryBranch(true)
                    .isActive(true)
                    .joiningDate(LocalDate.now())
                    .build();

            branchStaffRepository.save(branchStaff);
            log.info("User {} assigned to branch: {}", saved.getUsername(), branch.getBranchName());
        } else if (request.getRole() == Role.SUPER_ADMIN) {
            log.info("SUPER_ADMIN user created without branch assignment (has access to all branches)");
        }

        // Reload user with branch assignments
        saved = userRepository.findById(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userMapper.toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userMapper.updateEntityFromRequest(request, user);
        
        // Update branch assignment if branchId is provided and role is not SUPER_ADMIN
        if (request.getBranchId() != null && request.getRole() != Role.SUPER_ADMIN) {
            // Deactivate existing branch assignments
            user.getBranchAssignments().forEach(bs -> bs.setIsActive(false));
            
            // Find or create new primary branch assignment
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));
            
            BranchStaff existingAssignment = user.getBranchAssignments().stream()
                    .filter(bs -> bs.getBranch().getId().equals(request.getBranchId()))
                    .findFirst()
                    .orElse(null);
            
            if (existingAssignment != null) {
                existingAssignment.setIsActive(true);
                existingAssignment.setIsPrimaryBranch(true);
            } else {
                BranchStaff newAssignment = BranchStaff.builder()
                        .user(user)
                        .branch(branch)
                        .isPrimaryBranch(true)
                        .isActive(true)
                        .joiningDate(LocalDate.now())
                        .build();
                branchStaffRepository.save(newAssignment);
            }
            
            log.info("User {} branch updated to: {}", user.getUsername(), branch.getBranchName());
        } else if (request.getRole() == Role.SUPER_ADMIN) {
            // Deactivate all branch assignments for SUPER_ADMIN
            user.getBranchAssignments().forEach(bs -> bs.setIsActive(false));
            log.info("SUPER_ADMIN user updated - all branch assignments deactivated");
        }
        
        User updated = userRepository.save(user);
        
        // Reload user with updated branch assignments
        updated = userRepository.findById(updated.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userMapper.toUserResponse(updated);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return userMapper.toUserResponse(user);
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toUserResponse);
    }

    @Override
    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRole(role)
                .stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getActiveUsers() {
        return userRepository.findByIsActiveTrue()
                .stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setDeleted(true);
        user.setIsActive(false);
        userRepository.save(user);
        log.info("User deleted: {}", id);
    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsActive(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        log.info("Resetting password for user: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password reset for user: {}", id);
    }

    @Override
    public List<UserResponse> getUsersByBranch(Long branchId) {
        return userRepository.findUsersByBranch(branchId)
                .stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }
}
