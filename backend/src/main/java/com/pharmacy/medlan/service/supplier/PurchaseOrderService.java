package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.dto.request.supplier.CreatePurchaseOrderRequest;
import com.pharmacy.medlan.dto.response.supplier.PurchaseOrderResponse;
import com.pharmacy.medlan.enums.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseOrderService {
    
    PurchaseOrderResponse createPurchaseOrder(CreatePurchaseOrderRequest request);
    
    PurchaseOrderResponse getById(Long id);
    
    PurchaseOrderResponse getByPoNumber(String poNumber);
    
    Page<PurchaseOrderResponse> getAllPurchaseOrders(Pageable pageable);
    
    List<PurchaseOrderResponse> getBySupplier(Long supplierId);
    
    List<PurchaseOrderResponse> getByBranch(Long branchId);
    
    List<PurchaseOrderResponse> getByStatus(PurchaseOrderStatus status);
    
    List<PurchaseOrderResponse> getByDateRange(LocalDate startDate, LocalDate endDate);
    
    PurchaseOrderResponse updateStatus(Long id, PurchaseOrderStatus status);
    
    PurchaseOrderResponse approvePurchaseOrder(Long id);
    
    PurchaseOrderResponse rejectPurchaseOrder(Long id, String reason);
    
    void deletePurchaseOrder(Long id);
    
    String generatePoNumber();
}
