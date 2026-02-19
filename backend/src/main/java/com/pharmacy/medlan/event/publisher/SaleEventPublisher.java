package com.pharmacy.medlan.event.publisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class SaleEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    /**
     * Publish event when a sale is completed
     */
    public void publishSaleCompleted(Long saleId, Long branchId, BigDecimal totalAmount) {
        log.debug("Publishing sale completed event: sale={}, branch={}, amount={}",
                saleId, branchId, totalAmount);
        eventPublisher.publishEvent(new SaleCompletedEvent(this, saleId, branchId, totalAmount));
    }

    /**
     * Publish event when a sale is voided/cancelled
     */
    public void publishSaleVoided(Long saleId, Long branchId, String reason) {
        log.info("Publishing sale voided event: sale={}, branch={}, reason={}",
                saleId, branchId, reason);
        eventPublisher.publishEvent(new SaleVoidedEvent(this, saleId, branchId, reason));
    }

    /**
     * Publish event when a return is processed
     */
    public void publishReturnProcessed(Long returnId, Long saleId, BigDecimal refundAmount) {
        log.info("Publishing return processed event: return={}, sale={}, refund={}",
                returnId, saleId, refundAmount);
        eventPublisher.publishEvent(new ReturnProcessedEvent(this, returnId, saleId, refundAmount));
    }

    // --- Inner event classes ---

    public record SaleCompletedEvent(Object source, Long saleId, Long branchId, BigDecimal totalAmount) {
    }

    public record SaleVoidedEvent(Object source, Long saleId, Long branchId, String reason) {
    }

    public record ReturnProcessedEvent(Object source, Long returnId, Long saleId, BigDecimal refundAmount) {
    }
}
