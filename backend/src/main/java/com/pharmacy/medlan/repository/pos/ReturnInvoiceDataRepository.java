package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.ReturnInvoiceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnInvoiceDataRepository extends JpaRepository<ReturnInvoiceData, Long> {
}