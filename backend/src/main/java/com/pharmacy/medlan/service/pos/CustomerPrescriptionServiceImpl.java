package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerPrescriptionRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerPrescriptionResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.pos.Customer;
import com.pharmacy.medlan.model.pos.CustomerPrescription;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.repository.pos.CustomerPrescriptionRepository;
import com.pharmacy.medlan.repository.pos.CustomerRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerPrescriptionServiceImpl implements CustomerPrescriptionService {

    private final CustomerPrescriptionRepository prescriptionRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CustomerPrescriptionResponse createPrescription(CreateCustomerPrescriptionRequest request) {
        log.info("Creating prescription for customer: {}", request.getCustomerId());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        CustomerPrescription prescription = CustomerPrescription.builder()
                .customer(customer)
                .product(product)
                .productName(request.getProductName())
                .direction(request.getDirection())
                .duration(request.getDuration())
                .dosage(request.getDosage())
                .frequency(request.getFrequency())
                .quantityPrescribed(request.getQuantityPrescribed())
                .instructions(request.getInstructions())
                .build();

        CustomerPrescription saved = prescriptionRepository.save(prescription);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CustomerPrescriptionResponse updatePrescription(Long id, CreateCustomerPrescriptionRequest request) {
        CustomerPrescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        if (request.getDirection() != null) prescription.setDirection(request.getDirection());
        if (request.getDuration() != null) prescription.setDuration(request.getDuration());
        if (request.getDosage() != null) prescription.setDosage(request.getDosage());
        if (request.getFrequency() != null) prescription.setFrequency(request.getFrequency());
        if (request.getQuantityPrescribed() != null) prescription.setQuantityPrescribed(request.getQuantityPrescribed());
        if (request.getInstructions() != null) prescription.setInstructions(request.getInstructions());

        return toResponse(prescriptionRepository.save(prescription));
    }

    @Override
    public CustomerPrescriptionResponse getById(Long id) {
        CustomerPrescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        return toResponse(prescription);
    }

    @Override
    public List<CustomerPrescriptionResponse> getByCustomer(Long customerId) {
        return prescriptionRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerPrescriptionResponse> getByProduct(Long productId) {
        return prescriptionRepository.findByProductId(productId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePrescription(Long id) {
        CustomerPrescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        prescription.setDeleted(true);
        prescriptionRepository.save(prescription);
    }

    private CustomerPrescriptionResponse toResponse(CustomerPrescription p) {
        return CustomerPrescriptionResponse.builder()
                .id(p.getId())
                .customerId(p.getCustomer() != null ? p.getCustomer().getId() : null)
                .customerName(p.getCustomer() != null ? p.getCustomer().getCustomerName() : null)
                .productId(p.getProduct() != null ? p.getProduct().getId() : null)
                .productName(p.getProductName())
                .direction(p.getDirection())
                .duration(p.getDuration())
                .dosage(p.getDosage())
                .frequency(p.getFrequency())
                .quantityPrescribed(p.getQuantityPrescribed())
                .instructions(p.getInstructions())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
