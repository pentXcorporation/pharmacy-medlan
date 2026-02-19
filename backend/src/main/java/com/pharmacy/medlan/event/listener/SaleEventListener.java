package com.pharmacy.medlan.event.listener;

import com.pharmacy.medlan.event.publisher.SaleEventPublisher.SaleCompletedEvent;
import com.pharmacy.medlan.event.publisher.SaleEventPublisher.SaleVoidedEvent;
import com.pharmacy.medlan.event.publisher.SaleEventPublisher.ReturnProcessedEvent;
import com.pharmacy.medlan.event.publisher.NotificationEventPublisher;
import com.pharmacy.medlan.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SaleEventListener {

    private final NotificationEventPublisher notificationEventPublisher;

    @Async
    @EventListener
    public void handleSaleCompleted(SaleCompletedEvent event) {
        log.debug("Handling sale completed: sale={}, branch={}, amount={}",
                event.saleId(), event.branchId(), event.totalAmount());
        // Could trigger: inventory deduction, receipt generation, analytics update, etc.
    }

    @Async
    @EventListener
    public void handleSaleVoided(SaleVoidedEvent event) {
        log.info("Handling sale voided: sale={}, branch={}, reason={}",
                event.saleId(), event.branchId(), event.reason());

        notificationEventPublisher.publishBroadcastNotification(
                "Sale Voided",
                String.format("Sale #%d in branch %d has been voided. Reason: %s",
                        event.saleId(), event.branchId(), event.reason()),
                NotificationType.SYSTEM,
                event.branchId()
        );
    }

    @Async
    @EventListener
    public void handleReturnProcessed(ReturnProcessedEvent event) {
        log.info("Handling return processed: return={}, sale={}, refund={}",
                event.returnId(), event.saleId(), event.refundAmount());
        // Could trigger: inventory adjustment, refund processing, etc.
    }
}
