package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.dto.request.auth.ChangePasswordRequest;
import com.pharmacy.medlan.dto.request.auth.LoginRequest;
import com.pharmacy.medlan.dto.request.auth.RegisterRequest;
import com.pharmacy.medlan.dto.response.auth.LoginResponse;
import com.pharmacy.medlan.dto.response.user.UserResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);

    LoginResponse refreshToken(String refreshToken);

    void changePassword(String username, ChangePasswordRequest request);

    void logout(String username);

    UserResponse getCurrentUser(String username);
}
