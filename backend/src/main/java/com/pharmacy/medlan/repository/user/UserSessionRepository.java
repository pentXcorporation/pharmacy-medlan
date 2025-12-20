package com.pharmacy.medlan.repository.user;

import com.pharmacy.medlan.model.user.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findBySessionToken(String sessionToken);
    List<UserSession> findByUserIdAndIsActiveTrue(Long userId);

    @Query("SELECT us FROM UserSession us WHERE us.expiresAt < :now AND us.isActive = true")
    List<UserSession> findExpiredSessions(LocalDateTime now);

    void deleteByUserId(Long userId);
}