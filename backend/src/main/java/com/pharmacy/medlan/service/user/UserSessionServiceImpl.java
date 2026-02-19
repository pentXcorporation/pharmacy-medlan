package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.model.user.UserSession;
import com.pharmacy.medlan.repository.user.UserRepository;
import com.pharmacy.medlan.repository.user.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserSessionServiceImpl implements UserSessionService {

    private final UserSessionRepository userSessionRepository;
    private final UserRepository userRepository;

    @Override
    public UserSession createSession(Long userId, String sessionToken, String ipAddress, String userAgent) {
        log.info("Creating session for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserSession session = UserSession.builder()
                .user(user)
                .sessionToken(sessionToken)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .loginTime(LocalDateTime.now())
                .lastActivityTime(LocalDateTime.now())
                .isActive(true)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        return userSessionRepository.save(session);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSession getBySessionToken(String sessionToken) {
        return userSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSession> getActiveSessionsByUser(Long userId) {
        return userSessionRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    public void invalidateSession(String sessionToken) {
        UserSession session = getBySessionToken(sessionToken);
        session.setIsActive(false);
        session.setLogoutTime(LocalDateTime.now());
        userSessionRepository.save(session);
    }

    @Override
    public void invalidateAllUserSessions(Long userId) {
        List<UserSession> sessions = userSessionRepository.findByUserIdAndIsActiveTrue(userId);
        sessions.forEach(session -> {
            session.setIsActive(false);
            session.setLogoutTime(LocalDateTime.now());
        });
        userSessionRepository.saveAll(sessions);
    }

    @Override
    public void cleanupExpiredSessions() {
        log.info("Cleaning up expired sessions");
        List<UserSession> expired = userSessionRepository.findExpiredSessions(LocalDateTime.now());
        expired.forEach(session -> {
            session.setIsActive(false);
            session.setLogoutTime(LocalDateTime.now());
        });
        userSessionRepository.saveAll(expired);
        log.info("Cleaned up {} expired sessions", expired.size());
    }

    @Override
    @Transactional(readOnly = true)
    public int getActiveSessionCount() {
        return userSessionRepository.countActiveSessions();
    }

    @Override
    public void updateLastActivity(String sessionToken) {
        UserSession session = getBySessionToken(sessionToken);
        session.setLastActivityTime(LocalDateTime.now());
        userSessionRepository.save(session);
    }
}
