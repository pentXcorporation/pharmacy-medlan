/**
 * WebSocket Hook
 * Provides real-time communication utilities
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore, useNotificationStore } from '@/store';
import { API_CONFIG } from '@/config';

/**
 * WebSocket connection states
 */
export const WS_STATE = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
};

/**
 * Hook for WebSocket connection management
 * @param {Object} options - WebSocket options
 * @returns {Object} WebSocket utilities and state
 */
export const useWebSocket = (options = {}) => {
  const {
    autoConnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const [state, setState] = useState(WS_STATE.DISCONNECTED);
  const [lastMessage, setLastMessage] = useState(null);
  
  const { isAuthenticated, accessToken } = useAuthStore();
  const { addNotification } = useNotificationStore();

  /**
   * Get WebSocket URL
   */
  const getWsUrl = useCallback(() => {
    const wsUrl = API_CONFIG.WS_URL || API_CONFIG.BASE_URL.replace(/^http/, 'ws');
    return `${wsUrl}?token=${accessToken}`;
  }, [accessToken]);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    if (!isAuthenticated || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setState(WS_STATE.CONNECTING);
      wsRef.current = new WebSocket(getWsUrl());

      wsRef.current.onopen = () => {
        setState(WS_STATE.CONNECTED);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          
          // Handle different message types
          if (data.type === 'NOTIFICATION') {
            addNotification(data.payload);
          }
          
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setState(WS_STATE.DISCONNECTED);
        onDisconnect?.(event);
        
        // Attempt reconnection if not intentionally closed
        if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        setState(WS_STATE.ERROR);
        onError?.(error);
      };
    } catch (error) {
      setState(WS_STATE.ERROR);
      onError?.(error);
    }
  }, [isAuthenticated, getWsUrl, onConnect, onMessage, onDisconnect, onError, addNotification, maxReconnectAttempts, reconnectInterval]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnecting');
      wsRef.current = null;
    }
    
    setState(WS_STATE.DISCONNECTED);
  }, []);

  /**
   * Send message through WebSocket
   * @param {Object} data - Data to send
   */
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn('WebSocket is not connected');
    return false;
  }, []);

  /**
   * Subscribe to a topic
   * @param {string} topic - Topic to subscribe to
   */
  const subscribe = useCallback((topic) => {
    return send({ type: 'SUBSCRIBE', topic });
  }, [send]);

  /**
   * Unsubscribe from a topic
   * @param {string} topic - Topic to unsubscribe from
   */
  const unsubscribe = useCallback((topic) => {
    return send({ type: 'UNSUBSCRIBE', topic });
  }, [send]);

  // Auto-connect on mount if authenticated
  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated]);

  // Reconnect on token change
  useEffect(() => {
    if (isAuthenticated && state === WS_STATE.DISCONNECTED) {
      connect();
    } else if (!isAuthenticated && state !== WS_STATE.DISCONNECTED) {
      disconnect();
    }
  }, [isAuthenticated, accessToken]);

  return {
    // State
    state,
    isConnected: state === WS_STATE.CONNECTED,
    isConnecting: state === WS_STATE.CONNECTING,
    lastMessage,
    
    // Actions
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
  };
};

/**
 * Hook for subscribing to specific WebSocket topics
 * @param {string} topic - Topic to subscribe to
 * @param {Function} onMessage - Message handler
 * @returns {Object} Subscription state
 */
export const useSubscription = (topic, onMessage) => {
  const [messages, setMessages] = useState([]);
  
  const handleMessage = useCallback((data) => {
    if (data.topic === topic) {
      setMessages((prev) => [...prev.slice(-99), data.payload]);
      onMessage?.(data.payload);
    }
  }, [topic, onMessage]);

  const ws = useWebSocket({
    onMessage: handleMessage,
  });

  useEffect(() => {
    if (ws.isConnected) {
      ws.subscribe(topic);
    }
    
    return () => {
      if (ws.isConnected) {
        ws.unsubscribe(topic);
      }
    };
  }, [ws.isConnected, topic]);

  return {
    ...ws,
    messages,
    clearMessages: () => setMessages([]),
  };
};

export default useWebSocket;
