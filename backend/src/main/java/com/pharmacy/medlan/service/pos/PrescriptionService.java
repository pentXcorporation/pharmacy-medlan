package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreatePrescriptionRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerPrescriptionResponse;
import com.pharmacy.medlan.dto.response.pos.PrescriptionResponse;

import java.util.List;

public interface PrescriptionService {

    PrescriptionResponse createPrescription(CreatePrescriptionRequest request);

    List<CustomerPrescriptionResponse> getPrescriptionsByCustomer(Long customerId);

    CustomerPrescriptionResponse getPrescriptionById(Long id);

    void deletePrescription(Long id);
}
