package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.dto.request.user.CreateUserRequest;
import com.pharmacy.medlan.dto.request.user.UpdateUserRequest;
import com.pharmacy.medlan.dto.response.user.UserResponse;
import com.pharmacy.medlan.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    UserResponse getUserById(Long id);

    UserResponse getUserByUsername(String username);

    Page<UserResponse> getAllUsers(Pageable pageable);

    List<UserResponse> getUsersByRole(Role role);

    List<UserResponse> getActiveUsers();

    void deleteUser(Long id);

    void activateUser(Long id);

    void deactivateUser(Long id);

    void resetPassword(Long id, String newPassword);

    List<UserResponse> getUsersByBranch(Long branchId);
}
