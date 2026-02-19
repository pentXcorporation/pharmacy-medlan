package com.pharmacy.medlan.security;

import com.pharmacy.medlan.enums.CustomerStatus;
import com.pharmacy.medlan.model.pos.Customer;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetails implementation for Customer-facing authentication
 * (e.g., a future customer portal or loyalty app).
 */
@Getter
public class CustomerUserDetails implements UserDetails {

    private final Long id;
    private final String customerCode;
    private final String customerName;
    private final String email;
    private final String phoneNumber;
    private final String password;
    private final boolean active;

    public CustomerUserDetails(Customer customer, String password) {
        this.id = customer.getId();
        this.customerCode = customer.getCustomerCode();
        this.customerName = customer.getCustomerName();
        this.email = customer.getEmail();
        this.phoneNumber = customer.getPhoneNumber();
        this.password = password;
        this.active = customer.getStatus() == CustomerStatus.ACTIVE;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return customerCode;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}