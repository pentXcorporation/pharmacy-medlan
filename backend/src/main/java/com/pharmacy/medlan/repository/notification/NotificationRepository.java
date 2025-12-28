package com.pharmacy.medlan.repository.notification;

import com.pharmacy.medlan.model.notification.Notification;
import com.pharmacy.medlan.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByType(NotificationType type);
    
    List<Notification> findByIsReadFalse();
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    
    int countByUserIdAndIsReadFalse(Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId " +
            "AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadNotificationsByUser(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId " +
            "ORDER BY n.createdAt DESC")
    List<Notification> findAllNotificationsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUser(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt " +
           "WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId, @Param("readAt") LocalDateTime readAt);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.readAt < :beforeDate")
    void deleteOldReadNotifications(@Param("beforeDate") LocalDateTime beforeDate);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id IN " +
           "(SELECT bs.user.id FROM BranchStaff bs WHERE bs.branch.id = :branchId) " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findByBranchId(@Param("branchId") Long branchId);
    
    @Query("SELECT n FROM Notification n WHERE n.type = :type AND n.createdAt > :since " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findRecentByType(@Param("type") NotificationType type, 
                                        @Param("since") LocalDateTime since);
}