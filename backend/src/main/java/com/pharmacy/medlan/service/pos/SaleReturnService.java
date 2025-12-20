package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateSaleReturnRequest;
import com.pharmacy.medlan.dto.response.pos.SaleReturnResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface SaleReturnService {
    
    SaleReturnResponse createSaleReturn(CreateSaleReturnRequest request);
    
    SaleReturnResponse getById(Long id);
    
    SaleReturnResponse getByReturnNumber(String returnNumber);
    
    Page<SaleReturnResponse> getAllSaleReturns(Pageable pageable);
    
    List<SaleReturnResponse> getByCustomer(Long customerId);
    
    List<SaleReturnResponse> getByBranch(Long branchId);
    
    List<SaleReturnResponse> getByDateRange(LocalDate startDate, LocalDate endDate);
    
    void deleteSaleReturn(Long id);
    
    String generateReturnNumber();
}
