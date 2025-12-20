package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.exception.DuplicationResourceException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.product.Unit;
import com.pharmacy.medlan.repository.product.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;

    @Override
    @Transactional
    public Unit createUnit(String unitName, String unitCode) {
        if (unitRepository.existsByUnitName(unitName)) {
            throw new DuplicationResourceException("Unit name already exists");
        }

        Unit unit = Unit.builder()
                .unitName(unitName)
                .unitCode(unitCode)
                .isActive(true)
                .build();

        return unitRepository.save(unit);
    }

    @Override
    @Transactional
    public Unit updateUnit(Long id, String unitName) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));
        unit.setUnitName(unitName);
        return unitRepository.save(unit);
    }

    @Override
    public Unit getUnitById(Long id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));
    }

    @Override
    public List<Unit> getAllUnits() {
        return unitRepository.findAll();
    }

    @Override
    public List<Unit> getActiveUnits() {
        return unitRepository.findByIsActiveTrue();
    }

    @Override
    @Transactional
    public void deleteUnit(Long id) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));
        unit.setDeleted(true);
        unit.setIsActive(false);
        unitRepository.save(unit);
    }
}
