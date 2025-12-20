package com.pharmacy.medlan.repository.product;

import com.pharmacy.medlan.model.product.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    Optional<Unit> findByUnitName(String unitName);
    Optional<Unit> findByUnitCode(String unitCode);
    List<Unit> findByIsActiveTrue();
    boolean existsByUnitName(String unitName);
}
