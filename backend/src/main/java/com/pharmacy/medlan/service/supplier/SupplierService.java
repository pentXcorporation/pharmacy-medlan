package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.dto.request.supplier.CreateSupplierRequest;
import com.pharmacy.medlan.dto.response.supplier.SupplierResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SupplierService {

    SupplierResponse createSupplier(CreateSupplierRequest request);

    SupplierResponse updateSupplier(Long id, CreateSupplierRequest request);

    SupplierResponse getSupplierById(Long id);

    SupplierResponse getSupplierByCode(String supplierCode);

    Page<SupplierResponse> getAllSuppliers(Pageable pageable);

    List<SupplierResponse> searchSuppliers(String search);

    List<SupplierResponse> getActiveSuppliers();

    void deleteSupplier(Long id);

    void activateSupplier(Long id);

    void deactivateSupplier(Long id);

    String generateSupplierCode();
}
