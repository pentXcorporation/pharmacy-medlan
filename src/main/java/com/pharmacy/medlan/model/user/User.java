package com.pharmacy.medlan.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank
    @Column(nullable = true)
    private String password;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Pattern(regexp = "^[0-9\\-]{7,10}$", message = "Invalid Phone Number")
    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private String role;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(nullable = false)
    private LocalDateTime lastLogin;
}
