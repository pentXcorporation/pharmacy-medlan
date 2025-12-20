package com.pharmacy.medlan.repository.pos;

import com.pharmacy.medlan.model.pos.PatientNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PatientNumberRepository extends JpaRepository<PatientNumber, Long> {
    Optional<PatientNumber> findByToday(LocalDate today);
}
