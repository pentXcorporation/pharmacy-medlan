package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.dto.request.supplier.CreateSupplierRequest;
import com.pharmacy.medlan.dto.response.supplier.SupplierResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.mapper.SupplierMapper;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.repository.supplier.SupplierRepository;
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
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    @Transactional
    public SupplierResponse createSupplier(CreateSupplierRequest request) {
        log.info("Creating supplier: {}", request.getSupplierName());

        Supplier supplier = supplierMapper.toEntity(request);
        supplier.setSupplierCode(generateSupplierCode());

        Supplier saved = supplierRepository.save(supplier);
        log.info("Supplier created with code: {}", saved.getSupplierCode());

        return supplierMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public SupplierResponse updateSupplier(Long id, CreateSupplierRequest request) {
        log.info("Updating supplier: {}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplierMapper.updateEntityFromRequest(request, supplier);
        Supplier updated = supplierRepository.save(supplier);

        return supplierMapper.toResponse(updated);
    }

    @Override
    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        return supplierMapper.toResponse(supplier);
    }

    @Override
    public SupplierResponse getSupplierByCode(String supplierCode) {
        Supplier supplier = supplierRepository.findBySupplierCode(supplierCode)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with code: " + supplierCode));
        return supplierMapper.toResponse(supplier);
    }

    @Override
    public Page<SupplierResponse> getAllSuppliers(Pageable pageable) {
        return supplierRepository.findAll(pageable)
                .map(supplierMapper::toResponse);
    }

    @Override
    public List<SupplierResponse> searchSuppliers(String search) {
        return supplierRepository.searchSuppliers(search)
                .stream()
                .map(supplierMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierResponse> getActiveSuppliers() {
        return supplierRepository.findByIsActiveTrue()
                .stream()
                .map(supplierMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        log.info("Deleting supplier: {}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplier.setDeleted(true);
        supplier.setIsActive(false);
        supplierRepository.save(supplier);
        log.info("Supplier deleted: {}", id);
    }

    @Override
    @Transactional
    public void activateSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        supplier.setIsActive(true);
        supplierRepository.save(supplier);
    }

    @Override
    @Transactional
    public void deactivateSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        supplier.setIsActive(false);
        supplierRepository.save(supplier);
    }

    @Override
    public String generateSupplierCode() {
        Long count = supplierRepository.count();
        return String.format("SUP-%05d", count + 1);
    }
}
