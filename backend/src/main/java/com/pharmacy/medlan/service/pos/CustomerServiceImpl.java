package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerResponse;
import com.pharmacy.medlan.enums.CustomerStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.CustomerMapper;
import com.pharmacy.medlan.model.pos.Customer;
import com.pharmacy.medlan.repository.pos.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        log.info("Creating customer: {}", request.getCustomerName());

        Customer customer = customerMapper.toEntity(request);
        customer.setCustomerCode(generateCustomerCode());

        Customer saved = customerRepository.save(customer);
        log.info("Customer created with code: {}", saved.getCustomerCode());

        return customerMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CreateCustomerRequest request) {
        log.info("Updating customer: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customerMapper.updateEntityFromRequest(request, customer);
        Customer updated = customerRepository.save(customer);

        return customerMapper.toResponse(updated);
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return customerMapper.toResponse(customer);
    }

    @Override
    public CustomerResponse getCustomerByCode(String customerCode) {
        Customer customer = customerRepository.findByCustomerCode(customerCode)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with code: " + customerCode));
        return customerMapper.toResponse(customer);
    }

    @Override
    public Page<CustomerResponse> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(customerMapper::toResponse);
    }

    @Override
    public List<CustomerResponse> searchCustomers(String search) {
        return customerRepository.searchCustomers(search)
                .stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerResponse> getActiveCustomers() {
        return customerRepository.findByStatus(CustomerStatus.ACTIVE)
                .stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        log.info("Deleting customer: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setDeleted(true);
        customer.setStatus(CustomerStatus.INACTIVE);
        customerRepository.save(customer);
        log.info("Customer deleted: {}", id);
    }

    @Override
    @Transactional
    public void activateCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customer.setStatus(CustomerStatus.ACTIVE);
        customerRepository.save(customer);
    }

    @Override
    @Transactional
    public void deactivateCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customer.setStatus(CustomerStatus.INACTIVE);
        customerRepository.save(customer);
    }

    @Override
    public String generateCustomerCode() {
        Long count = customerRepository.count();
        return String.format("CUST-%05d", count + 1);
    }
}
