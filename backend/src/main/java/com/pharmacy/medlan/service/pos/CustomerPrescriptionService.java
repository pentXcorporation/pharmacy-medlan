package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerPrescriptionRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerPrescriptionResponse;

import java.util.List;

public interface CustomerPrescriptionService {

    CustomerPrescriptionResponse createPrescription(CreateCustomerPrescriptionRequest request);

    CustomerPrescriptionResponse updatePrescription(Long id, CreateCustomerPrescriptionRequest request);

    CustomerPrescriptionResponse getById(Long id);

    List<CustomerPrescriptionResponse> getByCustomer(Long customerId);

    List<CustomerPrescriptionResponse> getByProduct(Long productId);

    void deletePrescription(Long id);
}
