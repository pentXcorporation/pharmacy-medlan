package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.CustomerPrescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<CustomerPrescription, Long> {
}