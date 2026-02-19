package com.pharmacy.medlan.service.user;

import com.pharmacy.medlan.model.user.UserSession;

import java.util.List;

public interface UserSessionService {

    UserSession createSession(Long userId, String sessionToken, String ipAddress, String userAgent);

    UserSession getBySessionToken(String sessionToken);

    List<UserSession> getActiveSessionsByUser(Long userId);

    void invalidateSession(String sessionToken);

    void invalidateAllUserSessions(Long userId);

    void cleanupExpiredSessions();

    int getActiveSessionCount();

    void updateLastActivity(String sessionToken);
}
