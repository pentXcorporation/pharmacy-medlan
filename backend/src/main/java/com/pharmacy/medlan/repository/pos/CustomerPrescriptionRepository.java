package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.CustomerPrescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerPrescriptionRepository extends JpaRepository<CustomerPrescription, Long> {
    List<CustomerPrescription> findByCustomerId(Long customerId);
    List<CustomerPrescription> findByProductId(Long productId);
}