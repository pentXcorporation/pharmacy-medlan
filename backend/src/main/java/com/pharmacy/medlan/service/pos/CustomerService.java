package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    CustomerResponse createCustomer(CreateCustomerRequest request);

    CustomerResponse updateCustomer(Long id, CreateCustomerRequest request);

    CustomerResponse getCustomerById(Long id);

    CustomerResponse getCustomerByCode(String customerCode);

    Page<CustomerResponse> getAllCustomers(Pageable pageable);

    List<CustomerResponse> searchCustomers(String search);

    List<CustomerResponse> getActiveCustomers();

    void deleteCustomer(Long id);

    void activateCustomer(Long id);

    void deactivateCustomer(Long id);

    String generateCustomerCode();
}
