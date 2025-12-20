package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.CreateRGRNRequest;
import com.pharmacy.medlan.dto.response.inventory.RGRNResponse;
import com.pharmacy.medlan.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface RGRNService {
    
    RGRNResponse createRGRN(CreateRGRNRequest request);
    
    RGRNResponse getById(Long id);
    
    RGRNResponse getByRgrnNumber(String rgrnNumber);
    
    Page<RGRNResponse> getAllRGRNs(Pageable pageable);
    
    List<RGRNResponse> getBySupplier(Long supplierId);
    
    List<RGRNResponse> getByBranch(Long branchId);
    
    List<RGRNResponse> getByOriginalGrn(Long originalGrnId);
    
    List<RGRNResponse> getByRefundStatus(PaymentStatus refundStatus);
    
    List<RGRNResponse> getByDateRange(LocalDate startDate, LocalDate endDate);
    
    RGRNResponse updateRefundStatus(Long id, PaymentStatus refundStatus);
    
    void deleteRGRN(Long id);
    
    String generateRgrnNumber();
}
