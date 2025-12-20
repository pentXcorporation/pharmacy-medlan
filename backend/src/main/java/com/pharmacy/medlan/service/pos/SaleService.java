package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.dto.request.pos.CreateSaleRequest;
import com.pharmacy.medlan.dto.response.pos.SaleResponse;
import com.pharmacy.medlan.enums.SaleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleService {

    SaleResponse createSale(CreateSaleRequest request);

    SaleResponse getSaleById(Long id);

    SaleResponse getSaleBySaleNumber(String saleNumber);

    Page<SaleResponse> getAllSales(Pageable pageable);

    Page<SaleResponse> getSalesByBranch(Long branchId, Pageable pageable);

    Page<SaleResponse> getSalesByCustomer(Long customerId, Pageable pageable);

    List<SaleResponse> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<SaleResponse> getSalesByBranchAndDateRange(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    Page<SaleResponse> getSalesByStatus(SaleStatus status, Pageable pageable);

    SaleResponse cancelSale(Long id, String reason);

    SaleResponse voidSale(Long id, String reason);

    BigDecimal getTotalSalesByBranchAndDate(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    Long getSalesCountByBranchAndDate(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    String generateSaleNumber();
}
