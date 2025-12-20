package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.InvoiceReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceReturnRepository extends JpaRepository<InvoiceReturn, Long> {
    List<InvoiceReturn> findByInvoiceId(Long invoiceId);
}