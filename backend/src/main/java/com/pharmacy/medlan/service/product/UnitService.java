package com.pharmacy.medlan.service.product;

import com.pharmacy.medlan.model.product.Unit;
import java.util.List;

public interface UnitService {
    Unit createUnit(String unitName, String unitCode);
    Unit updateUnit(Long id, String unitName);
    Unit getUnitById(Long id);
    List<Unit> getAllUnits();
    List<Unit> getActiveUnits();
    void deleteUnit(Long id);
}