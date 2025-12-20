package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.InvoiceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceDataRepository extends JpaRepository<InvoiceData, Long> {
    List<InvoiceData> findByInvoiceId(Long invoiceId);
}
