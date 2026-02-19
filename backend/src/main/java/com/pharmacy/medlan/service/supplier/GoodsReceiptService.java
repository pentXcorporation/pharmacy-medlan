package com.pharmacy.medlan.service.supplier;

import com.pharmacy.medlan.model.supplier.GoodsReceipt;

import java.time.LocalDate;
import java.util.List;

public interface GoodsReceiptService {

    GoodsReceipt getById(Long id);

    GoodsReceipt getByReceiptNumber(String receiptNumber);

    List<GoodsReceipt> getBySupplier(Long supplierId);

    List<GoodsReceipt> getByBranch(Long branchId);

    List<GoodsReceipt> getByPurchaseOrder(Long purchaseOrderId);

    List<GoodsReceipt> getByDateRange(LocalDate startDate, LocalDate endDate);
}
