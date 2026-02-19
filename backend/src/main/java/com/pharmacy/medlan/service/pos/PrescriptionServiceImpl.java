package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerPrescriptionRequest;
import com.pharmacy.medlan.dto.request.pos.CreatePrescriptionRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerPrescriptionResponse;
import com.pharmacy.medlan.dto.response.pos.PrescriptionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final CustomerPrescriptionService customerPrescriptionService;

    @Override
    public PrescriptionResponse createPrescription(CreatePrescriptionRequest request) {
        log.info("Creating prescription for customer: {}", request.getCustomerId());

        List<CustomerPrescriptionResponse> items = new ArrayList<>();
        for (CreateCustomerPrescriptionRequest item : request.getItems()) {
            item.setCustomerId(request.getCustomerId());
            items.add(customerPrescriptionService.createPrescription(item));
        }

        return PrescriptionResponse.builder()
                .customerId(request.getCustomerId())
                .doctorName(request.getDoctorName())
                .hospitalName(request.getHospitalName())
                .notes(request.getNotes())
                .items(items)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerPrescriptionResponse> getPrescriptionsByCustomer(Long customerId) {
        return customerPrescriptionService.getByCustomer(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerPrescriptionResponse getPrescriptionById(Long id) {
        return customerPrescriptionService.getById(id);
    }

    @Override
    public void deletePrescription(Long id) {
        customerPrescriptionService.deletePrescription(id);
    }
}
