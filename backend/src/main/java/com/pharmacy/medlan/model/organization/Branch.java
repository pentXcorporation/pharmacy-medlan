package com.pharmacy.medlan.model.organization;

import com.pharmacy.medlan.model.base.AuditableEntity;
import com.pharmacy.medlan.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"manager", "staff", "inventory"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Branch extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "branch_code", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Branch code is required")
    @EqualsAndHashCode.Include
    private String branchCode;

    @Column(name = "branch_name", nullable = false, length = 200)
    @NotBlank(message = "Branch name is required")
    private String branchName;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 20)
    private String pincode;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "gstin_number", length = 50)
    private String gstinNumber;

    @Column(name = "drug_license_number", length = 50)
    private String drugLicenseNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_main_branch", nullable = false)
    @Builder.Default
    private Boolean isMainBranch = false;
}