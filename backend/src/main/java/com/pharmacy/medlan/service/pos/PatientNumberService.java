package com.pharmacy.medlan.service.pos;

import com.pharmacy.medlan.model.pos.PatientNumber;
import com.pharmacy.medlan.repository.pos.PatientNumberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PatientNumberService {

    private final PatientNumberRepository patientNumberRepository;

    public String generatePatientNumber() {
        LocalDate today = LocalDate.now();
        Long count = patientNumberRepository.count() + 1;

        PatientNumber patientNumber = PatientNumber.builder()
                .patientNumber(count.intValue())
                .today(today)
                .build();

        patientNumberRepository.save(patientNumber);

        return String.format("PT-%s-%05d", today.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")), count);
    }

    @Transactional(readOnly = true)
    public PatientNumber getLatestPatientNumber() {
        return patientNumberRepository.findAll()
                .stream()
                .reduce((first, second) -> second)
                .orElse(null);
    }
}
