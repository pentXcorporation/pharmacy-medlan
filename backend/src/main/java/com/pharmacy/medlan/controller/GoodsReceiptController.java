package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.supplier.GoodsReceipt;
import com.pharmacy.medlan.service.supplier.GoodsReceiptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goods-receipts")
@RequiredArgsConstructor
@Tag(name = "Goods Receipt", description = "Goods receipt management APIs")
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;

    @GetMapping("/{id}")
    @Operation(summary = "Get goods receipt by ID")
    public ResponseEntity<ApiResponse<GoodsReceipt>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(goodsReceiptService.getById(id)));
    }

    @GetMapping("/number/{receiptNumber}")
    @Operation(summary = "Get by receipt number")
    public ResponseEntity<ApiResponse<GoodsReceipt>> getByReceiptNumber(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(ApiResponse.success(goodsReceiptService.getByReceiptNumber(receiptNumber)));
    }

    @GetMapping("/supplier/{supplierId}")
    @Operation(summary = "Get by supplier")
    public ResponseEntity<ApiResponse<List<GoodsReceipt>>> getBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(ApiResponse.success(goodsReceiptService.getBySupplier(supplierId)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get by branch")
    public ResponseEntity<ApiResponse<List<GoodsReceipt>>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(goodsReceiptService.getByBranch(branchId)));
    }

    @GetMapping("/purchase-order/{poId}")
    @Operation(summary = "Get by purchase order")
    public ResponseEntity<ApiResponse<List<GoodsReceipt>>> getByPurchaseOrder(@PathVariable Long poId) {
        return ResponseEntity.ok(ApiResponse.success(goodsReceiptService.getByPurchaseOrder(poId)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get by date range")
    public ResponseEntity<ApiResponse<List<GoodsReceipt>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(goodsReceiptService.getByDateRange(startDate, endDate)));
    }
}
