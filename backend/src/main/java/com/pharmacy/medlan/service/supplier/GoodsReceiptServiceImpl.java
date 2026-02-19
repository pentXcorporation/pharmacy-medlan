package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.supplier.GoodsReceipt;
import com.pharmacy.medlan.repository.supplier.GoodsReceiptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;

    @Override
    public GoodsReceipt getById(Long id) {
        return goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goods receipt not found with id: " + id));
    }

    @Override
    public GoodsReceipt getByReceiptNumber(String receiptNumber) {
        return goodsReceiptRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Goods receipt not found with number: " + receiptNumber));
    }

    @Override
    public List<GoodsReceipt> getBySupplier(Long supplierId) {
        return goodsReceiptRepository.findBySupplierId(supplierId);
    }

    @Override
    public List<GoodsReceipt> getByBranch(Long branchId) {
        return goodsReceiptRepository.findByBranchId(branchId);
    }

    @Override
    public List<GoodsReceipt> getByPurchaseOrder(Long purchaseOrderId) {
        return goodsReceiptRepository.findByPurchaseOrderId(purchaseOrderId);
    }

    @Override
    public List<GoodsReceipt> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return goodsReceiptRepository.findByReceiptDateBetween(startDate, endDate);
    }
}
