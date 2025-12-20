package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.user.CreateUserRequest;
import com.pharmacy.medlan.dto.request.user.UpdateUserRequest;
import com.pharmacy.medlan.dto.response.user.UserResponse;
import com.pharmacy.medlan.model.user.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
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
                .build();
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

    public void updateEntityFromRequest(UpdateUserRequest request, User user) {
        if (request == null || user == null) {
            return;
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }
        if (request.getDiscountLimit() != null) {
            user.setDiscountLimit(request.getDiscountLimit());
        }
        if (request.getCreditTransactionLimit() != null) {
            user.setCreditTransactionLimit(request.getCreditTransactionLimit());
        }
    }
}
