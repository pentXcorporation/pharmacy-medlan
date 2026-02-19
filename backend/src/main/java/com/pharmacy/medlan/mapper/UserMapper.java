package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.user.CreateUserRequest;
import com.pharmacy.medlan.dto.request.user.UpdateUserRequest;
import com.pharmacy.medlan.dto.response.user.UserResponse;
import com.pharmacy.medlan.model.user.BranchStaff;
import com.pharmacy.medlan.model.user.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        Long branchId = null;
        String branchName = null;

        if (user.getBranchAssignments() != null && !user.getBranchAssignments().isEmpty()) {
            // Prefer the primary active assignment; fall back to any active assignment
            BranchStaff assignment = user.getBranchAssignments().stream()
                    .filter(bs -> Boolean.TRUE.equals(bs.getIsPrimaryBranch()) && Boolean.TRUE.equals(bs.getIsActive()))
                    .findFirst()
                    .orElseGet(() -> user.getBranchAssignments().stream()
                            .filter(bs -> Boolean.TRUE.equals(bs.getIsActive()))
                            .findFirst()
                            .orElse(null));

            if (assignment != null && assignment.getBranch() != null) {
                branchId = assignment.getBranch().getId();
                branchName = assignment.getBranch().getBranchName();
            }
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .lastLoginDate(user.getLastLoginDate())
                .discountLimit(user.getDiscountLimit())
                .creditTransactionLimit(user.getCreditTransactionLimit())
                .employeeCode(user.getEmployeeCode())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .branchId(branchId)
                .branchName(branchName)
                .build();
    }

    public List<UserResponse> toUserResponseList(List<User> users) {
        if (users == null) return Collections.emptyList();
        return users.stream().map(this::toUserResponse).collect(Collectors.toList());
    }

    public User toEntity(CreateUserRequest request) {
        if (request == null) {
            return null;
        }

        return User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .employeeCode(request.getEmployeeCode())
                .discountLimit(request.getDiscountLimit())
                .creditTransactionLimit(request.getCreditTransactionLimit())
                .isActive(true)
                .build();
    }

    /** Applies only non-null fields — safe for PATCH-style partial updates. */
    public void updateEntityFromRequest(UpdateUserRequest request, User user) {
        if (request == null || user == null) return;

        if (request.getFullName() != null)                user.setFullName(request.getFullName());
        if (request.getEmail() != null)                   user.setEmail(request.getEmail());
        if (request.getPhoneNumber() != null)             user.setPhoneNumber(request.getPhoneNumber());
        if (request.getRole() != null)                    user.setRole(request.getRole());
        if (request.getIsActive() != null)                user.setIsActive(request.getIsActive());
        if (request.getDiscountLimit() != null)           user.setDiscountLimit(request.getDiscountLimit());
        if (request.getCreditTransactionLimit() != null)  user.setCreditTransactionLimit(request.getCreditTransactionLimit());
    }
}