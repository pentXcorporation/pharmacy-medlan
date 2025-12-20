package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.ApproveStockTransferRequest;
import com.pharmacy.medlan.dto.request.inventory.CreateStockTransferRequest;
import com.pharmacy.medlan.dto.response.inventory.StockTransferResponse;
import com.pharmacy.medlan.enums.StockTransferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface StockTransferService {
    
    StockTransferResponse createStockTransfer(CreateStockTransferRequest request);
    
    StockTransferResponse getById(Long id);
    
    StockTransferResponse getByTransferNumber(String transferNumber);
    
    Page<StockTransferResponse> getAllStockTransfers(Pageable pageable);
    
    List<StockTransferResponse> getByFromBranch(Long fromBranchId);
    
    List<StockTransferResponse> getByToBranch(Long toBranchId);
    
    List<StockTransferResponse> getByBranch(Long branchId);
    
    List<StockTransferResponse> getByStatus(StockTransferStatus status);
    
    List<StockTransferResponse> getByDateRange(LocalDate startDate, LocalDate endDate);
    
    StockTransferResponse approveStockTransfer(Long id, ApproveStockTransferRequest request);
    
    StockTransferResponse receiveStockTransfer(Long id, Long receivedByUserId);
    
    StockTransferResponse rejectStockTransfer(Long id, String reason);
    
    StockTransferResponse cancelStockTransfer(Long id, String reason);
    
    String generateTransferNumber();
}
