import pushManager, { usePushNotifications } from '../push';

// Mock Notification API
const mockNotification = {
  close: jest.fn(),
  onclick: null,
};

Object.defineProperty(global, 'Notification', {
  value: jest.fn().mockImplementation(() => mockNotification),
  writable: true,
});

Object.defineProperty(global, 'navigator', {
  value: {
    serviceWorker: {
      ready: Promise.resolve({
        pushManager: {
          subscribe: jest.fn(),
          getSubscription: jest.fn(),
        },
      }),
    },
  },
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: {
    atob: jest.fn((str) => Buffer.from(str, 'base64').toString('binary')),
  },
  writable: true,
});

Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true,
});

describe('PushManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.Notification as any).permission = 'default';
  });

  describe('checkSupport', () => {
    it('should return true when all required APIs are available', () => {
      expect(pushManager.isPushSupported).toBe(true);
    });

    it('should return false when Notification API is not available', () => {
      delete (global as any).Notification;
      const manager = new (require('../push').default)();
      expect(manager.isPushSupported).toBe(false);
    });
  });

  describe('requestPermission', () => {
    it('should return granted permission when already granted', async () => {
      (global.Notification as any).permission = 'granted';
      
      const permission = await pushManager.requestPermission();
      expect(permission).toBe('granted');
    });

    it('should request permission when not set', async () => {
      (global.Notification as any).permission = 'default';
      (global.Notification as any).requestPermission = jest.fn().mockResolvedValue('granted');
      
      const permission = await pushManager.requestPermission();
      expect(permission).toBe('granted');
      expect((global.Notification as any).requestPermission).toHaveBeenCalled();
    });

    it('should throw error when permission is denied', async () => {
      (global.Notification as any).permission = 'denied';
      
      await expect(pushManager.requestPermission()).rejects.toThrow('Push notifications are blocked');
    });
  });

  describe('subscribe', () => {
    it('should subscribe to push notifications', async () => {
      const mockSubscription = {
        endpoint: 'https://example.com/endpoint',
        keys: {
          p256dh: 'key1',
          auth: 'key2',
        },
      };

      (global.Notification as any).permission = 'granted';
      (global.navigator.serviceWorker.ready as any).then = jest.fn().mockResolvedValue({
        pushManager: {
          subscribe: jest.fn().mockResolvedValue({
            toJSON: () => mockSubscription,
          }),
        },
      });

      const subscription = await pushManager.subscribe();
      expect(subscription).toEqual(mockSubscription);
    });

    it('should throw error when permission is not granted', async () => {
      (global.Notification as any).permission = 'denied';
      
      await expect(pushManager.subscribe()).rejects.toThrow('Permission denied');
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from push notifications', async () => {
      const mockSubscription = {
        unsubscribe: jest.fn().mockResolvedValue(true),
      };

      (global.navigator.serviceWorker.ready as any).then = jest.fn().mockResolvedValue({
        pushManager: {
          getSubscription: jest.fn().mockResolvedValue(mockSubscription),
        },
      });

      const result = await pushManager.unsubscribe();
      expect(result).toBe(true);
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should return true when no subscription exists', async () => {
      (global.navigator.serviceWorker.ready as any).then = jest.fn().mockResolvedValue({
        pushManager: {
          getSubscription: jest.fn().mockResolvedValue(null),
        },
      });

      const result = await pushManager.unsubscribe();
      expect(result).toBe(true);
    });
  });

  describe('sendSubscriptionToServer', () => {
    it('should send subscription to server', async () => {
      const mockSubscription = {
        endpoint: 'https://example.com/endpoint',
        keys: { p256dh: 'key1', auth: 'key2' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await pushManager.sendSubscriptionToServer(mockSubscription);
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: mockSubscription }),
      });
    });

    it('should handle server errors', async () => {
      const mockSubscription = {
        endpoint: 'https://example.com/endpoint',
        keys: { p256dh: 'key1', auth: 'key2' },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
      });

      const result = await pushManager.sendSubscriptionToServer(mockSubscription);
      expect(result).toBe(false);
    });
  });

  describe('showLocalNotification', () => {
    it('should show local notification', async () => {
      (global.Notification as any).permission = 'granted';
      
      const payload = {
        title: 'Test Notification',
        body: 'Test message',
        icon: '/icon.png',
      };

      await pushManager.showLocalNotification(payload);
      
      expect(global.Notification).toHaveBeenCalledWith('Test Notification', {
        body: 'Test message',
        icon: '/icon.png',
        badge: '/favicon.svg',
        image: undefined,
        tag: undefined,
        data: undefined,
        actions: undefined,
        requireInteraction: undefined,
        silent: undefined,
        vibrate: undefined,
        timestamp: expect.any(Number),
      });
    });

    it('should throw error when permission is not granted', async () => {
      (global.Notification as any).permission = 'denied';
      
      const payload = {
        title: 'Test Notification',
        body: 'Test message',
      };

      await expect(pushManager.showLocalNotification(payload)).rejects.toThrow('Permission denied');
    });
  });
});

describe('usePushNotifications', () => {
  it('should return push notification utilities', () => {
    const result = usePushNotifications();
    
    expect(result).toHaveProperty('isSupported');
    expect(result).toHaveProperty('permission');
    expect(result).toHaveProperty('subscription');
    expect(result).toHaveProperty('isLoading');
    expect(result).toHaveProperty('subscribe');
    expect(result).toHaveProperty('unsubscribe');
    expect(result).toHaveProperty('requestPermission');
    expect(result).toHaveProperty('isSubscribed');
    
    expect(typeof result.subscribe).toBe('function');
    expect(typeof result.unsubscribe).toBe('function');
    expect(typeof result.requestPermission).toBe('function');
  });
});
