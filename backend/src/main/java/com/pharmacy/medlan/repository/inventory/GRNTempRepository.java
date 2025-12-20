package com.pharmacy.medlan.repository.inventory;

import com.pharmacy.medlan.model.inventory.GRNTemp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GRNTempRepository extends JpaRepository<GRNTemp, Long> {

    List<GRNTemp> findByUserId(Long userId);

    List<GRNTemp> findByGrnNumber(String grnNumber);

    List<GRNTemp> findByProductId(Long productId);

    List<GRNTemp> findByStatus(Integer status);

    List<GRNTemp> findByUserIdAndStatus(Long userId, Integer status);

    List<GRNTemp> findByUserIdAndGrnNumber(Long userId, String grnNumber);

    @Query("SELECT gt FROM GRNTemp gt WHERE gt.userId = :userId AND gt.status = 0 " +
            "ORDER BY gt.id DESC")
    List<GRNTemp> findPendingByUser(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM GRNTemp gt WHERE gt.userId = :userId AND gt.grnNumber = :grnNumber")
    void deleteByUserAndGrnNumber(@Param("userId") Long userId, @Param("grnNumber") String grnNumber);

    @Modifying
    @Query("DELETE FROM GRNTemp gt WHERE gt.userId = :userId")
    void deleteAllByUser(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE GRNTemp gt SET gt.status = :status WHERE gt.grnNumber = :grnNumber")
    void updateStatusByGrnNumber(@Param("grnNumber") String grnNumber, @Param("status") Integer status);

    @Query("SELECT COUNT(gt) FROM GRNTemp gt WHERE gt.userId = :userId AND gt.status = 0")
    Long countPendingByUser(@Param("userId") Long userId);
}
