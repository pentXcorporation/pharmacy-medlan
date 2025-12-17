package com.pharmacy.medlan.model.organization;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Pattern;


@Entity
@Table(name = "branch")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "branch_id")
    private long branchId;

    @Column(name = "branch_code", unique = true, nullable = false)
    private String branchCode;

    @Column(name = "branch_type", nullable = false)
    private String branchType; // Main, Satellite

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address")
    private String address;

    @Pattern(regexp = "^[0-9\\-]{7,10}$", message = "Invalid Phone Number")
    @Column(nullable = false, unique = true)
    private String phone;

    @Email
    @Column(name = "email", unique = true, nullable = false)
    private String email;
}
