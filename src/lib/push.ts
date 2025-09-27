/**
 * Web Push Notification utilities
 */

import { useState, useEffect } from 'react';

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  url?: string;
}

class PushManager {
  private vapidPublicKey: string;
  private isSupported: boolean;

  constructor() {
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported in this browser');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Push notifications are blocked. Please enable them in your browser settings.');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  public async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission denied for push notifications');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      return subscription.toJSON() as PushSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }

  public async unsubscribe(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        return await subscription.unsubscribe();
      }
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  public async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      return subscription ? subscription.toJSON() as PushSubscription : null;
    } catch (error) {
      console.error('Error getting push subscription:', error);
      return null;
    }
  }

  public async sendSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      return false;
    }
  }

  public async removeSubscriptionFromServer(): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error removing subscription from server:', error);
      return false;
    }
  }

  public async showLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Notifications are not supported');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission denied for notifications');
    }

    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/favicon.svg',
      badge: payload.badge || '/favicon.svg',
      // image: payload.image, // Not supported in NotificationOptions
      tag: payload.tag,
      data: payload.data,
      // actions: payload.actions, // Not supported in NotificationOptions
      requireInteraction: payload.requireInteraction,
      silent: payload.silent,
      // vibrate: payload.vibrate, // Not supported in NotificationOptions
      // timestamp: Date.now(), // Not supported in NotificationOptions
    };

    const notification = new Notification(payload.title, options);

    notification.onclick = () => {
      window.focus();
      if (payload.url) {
        window.location.href = payload.url;
      }
      notification.close();
    };
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  public get isPushSupported(): boolean {
    return this.isSupported;
  }

  public get permissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

// Singleton instance
const pushManager = new PushManager();

export default pushManager;

// Hook for React components
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(pushManager.isPushSupported);
  const [permission, setPermission] = useState(pushManager.permissionStatus);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const sub = await pushManager.getSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  const subscribe = async () => {
    setIsLoading(true);
    try {
      const sub = await pushManager.subscribe();
      if (sub) {
        const success = await pushManager.sendSubscriptionToServer(sub);
        if (success) {
          setSubscription(sub);
          setPermission('granted');
        }
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await pushManager.unsubscribe();
      if (success) {
        await pushManager.removeSubscriptionFromServer();
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await pushManager.requestPermission();
      setPermission(permission);
      return permission;
    } catch (error) {
      console.error('Error requesting permission:', error);
      throw error;
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    isLoading,
    subscribe,
    unsubscribe,
    requestPermission,
    isSubscribed: !!subscription,
  };
}
