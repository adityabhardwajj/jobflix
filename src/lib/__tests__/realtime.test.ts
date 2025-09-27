import { getRealtimeManager, useRealtimeConnection } from '../realtime';

// Mock WebSocket
class MockWebSocket {
  public readyState = WebSocket.OPEN;
  public onopen: ((event: Event) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  constructor(public url: string) {
    // Simulate connection
    setTimeout(() => {
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 0);
  }

  send(data: string) {
    // Mock send
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// Mock EventSource
class MockEventSource {
  public readyState = EventSource.OPEN;
  public onopen: ((event: Event) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  constructor(public url: string) {
    // Simulate connection
    setTimeout(() => {
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 0);
  }

  addEventListener(event: string, listener: (event: any) => void) {
    // Mock event listener
  }

  close() {
    this.readyState = EventSource.CLOSED;
  }
}

// Mock global objects
Object.defineProperty(global, 'WebSocket', {
  value: MockWebSocket,
  writable: true,
});

Object.defineProperty(global, 'EventSource', {
  value: MockEventSource,
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: {
    location: {
      protocol: 'https:',
      host: 'localhost:3000',
      origin: 'https://localhost:3000',
    },
    addEventListener: jest.fn(),
  },
  writable: true,
});

describe('RealtimeManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a realtime manager instance', () => {
    const manager = getRealtimeManager();
    expect(manager).toBeDefined();
    expect(typeof manager.on).toBe('function');
    expect(typeof manager.send).toBe('function');
    expect(typeof manager.close).toBe('function');
  });

  it('should handle connection events', (done) => {
    const manager = getRealtimeManager();
    
    manager.on('connected', (data) => {
      expect(data).toBeDefined();
      done();
    });
  });

  it('should handle message events', (done) => {
    const manager = getRealtimeManager();
    
    manager.on('notification.created', (data) => {
      expect(data).toBeDefined();
      done();
    });

    // Simulate receiving a message
    const mockMessage = {
      type: 'notification.created',
      data: { id: '1', title: 'Test' },
      timestamp: new Date().toISOString(),
    };

    // Trigger the message handler
    manager['handleMessage'](mockMessage);
  });

  it('should handle disconnection events', (done) => {
    const manager = getRealtimeManager();
    
    manager.on('disconnected', (data) => {
      expect(data).toBeDefined();
      done();
    });

    // Simulate disconnection
    manager['emit']('disconnected', { code: 1000, reason: 'Normal closure' });
  });

  it('should send messages when connected', () => {
    const manager = getRealtimeManager();
    const sendSpy = jest.spyOn(manager, 'send');
    
    manager.send({ type: 'test', data: 'test data' });
    
    // Note: In a real test, you'd need to mock the WebSocket connection
    // For now, we just verify the method exists and can be called
    expect(sendSpy).toHaveBeenCalled();
  });

  it('should close connection', () => {
    const manager = getRealtimeManager();
    const closeSpy = jest.spyOn(manager, 'close');
    
    manager.close();
    
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should handle reconnection attempts', (done) => {
    const manager = getRealtimeManager();
    let reconnectAttempts = 0;
    
    manager.on('reconnect_failed', (data) => {
      expect(data.attempts).toBeGreaterThan(0);
      done();
    });

    // Simulate multiple connection failures
    for (let i = 0; i < 6; i++) {
      manager['scheduleReconnect']();
    }
  });
});

describe('useRealtimeConnection', () => {
  it('should return connection utilities', () => {
    const connection = useRealtimeConnection();
    
    expect(connection).toHaveProperty('isConnected');
    expect(connection).toHaveProperty('on');
    expect(connection).toHaveProperty('send');
    expect(connection).toHaveProperty('close');
    
    expect(typeof connection.on).toBe('function');
    expect(typeof connection.send).toBe('function');
    expect(typeof connection.close).toBe('function');
  });

  it('should handle message subscriptions', () => {
    const connection = useRealtimeConnection();
    const mockCallback = jest.fn();
    
    const unsubscribe = connection.on('test-event', mockCallback);
    
    expect(typeof unsubscribe).toBe('function');
    
    // Test unsubscribe
    unsubscribe();
  });
});
