/**
 * Real-time notification system using WebSocket with EventSource fallback
 */

export interface RealtimeMessage {
  type: 'notification.created' | 'notification.updated' | 'notification.deleted';
  data: any;
  timestamp: string;
}

export interface RealtimeConnection {
  isConnected: boolean;
  send: (message: any) => void;
  close: () => void;
}

class RealtimeManager {
  private connection: WebSocket | EventSource | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      // Try WebSocket first
      this.connectWebSocket();
    } catch (error) {
      console.error('WebSocket connection failed, trying EventSource:', error);
      this.connectEventSource();
    }
  }

  private connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;
    
    this.connection = new WebSocket(wsUrl);

    this.connection.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.emit('connected', { type: 'websocket' });
    };

    this.connection.onmessage = (event) => {
      try {
        const message: RealtimeMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.connection.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnecting = false;
      this.emit('disconnected', { code: event.code, reason: event.reason });
      this.scheduleReconnect();
    };

    this.connection.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      this.connection?.close();
      this.connectEventSource();
    };
  }

  private connectEventSource() {
    const eventSourceUrl = `${window.location.origin}/api/notifications/stream`;
    
    this.connection = new EventSource(eventSourceUrl);

    this.connection.onopen = () => {
      console.log('EventSource connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.emit('connected', { type: 'eventsource' });
    };

    this.connection.addEventListener('notification.created', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage({
          type: 'notification.created',
          data,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error parsing EventSource message:', error);
      }
    });

    this.connection.addEventListener('notification.updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage({
          type: 'notification.updated',
          data,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error parsing EventSource message:', error);
      }
    });

    this.connection.onerror = (error) => {
      console.error('EventSource error:', error);
      this.isConnecting = false;
      this.connection?.close();
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect_failed', { attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(message: RealtimeMessage) {
    this.emit(message.type, message.data);
    this.emit('message', message);
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in realtime listener:', error);
        }
      });
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  public send(message: any) {
    if (this.connection && this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message));
    } else {
      console.warn('Connection not available for sending message');
    }
  }

  public close() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.listeners.clear();
  }

  public get isConnected() {
    if (this.connection instanceof WebSocket) {
      return this.connection.readyState === WebSocket.OPEN;
    }
    if (this.connection instanceof EventSource) {
      return this.connection.readyState === EventSource.OPEN;
    }
    return false;
  }
}

// Singleton instance
let realtimeManager: RealtimeManager | null = null;

export function getRealtimeManager(): RealtimeManager {
  if (!realtimeManager) {
    realtimeManager = new RealtimeManager();
  }
  return realtimeManager;
}

export function useRealtimeConnection() {
  const manager = getRealtimeManager();
  
  return {
    isConnected: manager.isConnected,
    on: manager.on.bind(manager),
    send: manager.send.bind(manager),
    close: manager.close.bind(manager),
  };
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (realtimeManager) {
      realtimeManager.close();
    }
  });
}
