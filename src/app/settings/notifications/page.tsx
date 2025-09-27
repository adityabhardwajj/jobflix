'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Button,
  Divider,
  Chip,
  Spinner,
} from '@heroui/react';
import { Bell, BellOff, Smartphone, Mail, Settings } from 'lucide-react';
import { usePushNotifications } from '@/lib/push';
import { NotificationSettings } from '@/app/types/notifications';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: false,
    in_app_notifications: true,
    job_match_notifications: true,
    application_update_notifications: true,
    system_notifications: true,
    reminder_notifications: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    isSupported: isPushSupported,
    permission: pushPermission,
    isSubscribed,
    isLoading: pushLoading,
    subscribe: subscribeToPush,
    unsubscribe: unsubscribeFromPush,
    requestPermission: requestPushPermission,
  } = typeof window !== 'undefined' ? usePushNotifications() : {
    isSupported: false,
    permission: 'default' as NotificationPermission,
    isSubscribed: false,
    isLoading: false,
    subscribe: async () => {},
    unsubscribe: async () => {},
    requestPermission: async () => 'default' as NotificationPermission,
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        setSettings(newSettings);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        if (pushPermission !== 'granted') {
          await requestPushPermission();
        }
        await subscribeToPush();
      } catch (error) {
        console.error('Error enabling push notifications:', error);
        // Revert the setting if push subscription failed
        setSettings(prev => ({ ...prev, push_notifications: false }));
      }
    } else {
      try {
        await unsubscribeFromPush();
      } catch (error) {
        console.error('Error disabling push notifications:', error);
      }
    }
  };

  const getPermissionStatus = () => {
    if (typeof window === 'undefined') return 'not-supported';
    if (!isPushSupported) return 'not-supported';
    if (pushPermission === 'granted') return 'granted';
    if (pushPermission === 'denied') return 'denied';
    return 'default';
  };

  const getPermissionChip = () => {
    const status = getPermissionStatus();
    switch (status) {
      case 'granted':
        return <Chip color="success" size="sm">Enabled</Chip>;
      case 'denied':
        return <Chip color="danger" size="sm">Blocked</Chip>;
      case 'not-supported':
        return <Chip color="warning" size="sm">Not Supported</Chip>;
      default:
        return <Chip color="default" size="sm">Not Set</Chip>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-primary" size={24} />
        <h1 className="text-2xl font-bold">Notification Settings</h1>
      </div>

      {/* Push Notifications Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Smartphone size={20} />
              <div>
                <h3 className="text-lg font-semibold">Push Notifications</h3>
                <p className="text-sm text-muted-fg">
                  Receive notifications even when the app is closed
                </p>
              </div>
            </div>
            {getPermissionChip()}
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-fg">
                {isPushSupported
                  ? 'Browser notifications are supported'
                  : 'Browser notifications are not supported in this browser'}
              </p>
              {pushPermission === 'denied' && (
                <p className="text-sm text-danger mt-1">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              )}
            </div>
            <Switch
              isSelected={settings.push_notifications && isSubscribed}
              onValueChange={handlePushToggle}
              isDisabled={!isPushSupported || pushLoading}
              color="primary"
            />
          </div>
        </CardBody>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings size={20} />
            <div>
              <h3 className="text-lg font-semibold">Notification Types</h3>
              <p className="text-sm text-muted-fg">
                Choose which types of notifications you want to receive
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-muted-fg" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-fg">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              isSelected={settings.email_notifications}
              onValueChange={(value) => handleSettingChange('email_notifications', value)}
              color="primary"
            />
          </div>

          <Divider />

          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-muted-fg" />
              <div>
                <p className="font-medium">In-App Notifications</p>
                <p className="text-sm text-muted-fg">
                  Show notifications within the app
                </p>
              </div>
            </div>
            <Switch
              isSelected={settings.in_app_notifications}
              onValueChange={(value) => handleSettingChange('in_app_notifications', value)}
              color="primary"
            />
          </div>

          <Divider />

          {/* Job Match Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-success">🎯</div>
              <div>
                <p className="font-medium">Job Match Notifications</p>
                <p className="text-sm text-muted-fg">
                  Get notified when new jobs match your profile
                </p>
              </div>
            </div>
            <Switch
              isSelected={settings.job_match_notifications}
              onValueChange={(value) => handleSettingChange('job_match_notifications', value)}
              color="primary"
            />
          </div>

          <Divider />

          {/* Application Update Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-primary">📝</div>
              <div>
                <p className="font-medium">Application Updates</p>
                <p className="text-sm text-muted-fg">
                  Get notified about your job application status
                </p>
              </div>
            </div>
            <Switch
              isSelected={settings.application_update_notifications}
              onValueChange={(value) => handleSettingChange('application_update_notifications', value)}
              color="primary"
            />
          </div>

          <Divider />

          {/* System Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-warning">⚙️</div>
              <div>
                <p className="font-medium">System Notifications</p>
                <p className="text-sm text-muted-fg">
                  Important updates about the platform
                </p>
              </div>
            </div>
            <Switch
              isSelected={settings.system_notifications}
              onValueChange={(value) => handleSettingChange('system_notifications', value)}
              color="primary"
            />
          </div>

          <Divider />

          {/* Reminder Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-secondary">⏰</div>
              <div>
                <p className="font-medium">Reminder Notifications</p>
                <p className="text-sm text-muted-fg">
                  Get reminded about important tasks and deadlines
                </p>
              </div>
            </div>
            <Switch
              isSelected={settings.reminder_notifications}
              onValueChange={(value) => handleSettingChange('reminder_notifications', value)}
              color="primary"
            />
          </div>
        </CardBody>
      </Card>

      {/* Test Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell size={20} />
            <div>
              <h3 className="text-lg font-semibold">Test Notifications</h3>
              <p className="text-sm text-muted-fg">
                Test your notification settings
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex gap-3">
            <Button
              color="primary"
              variant="flat"
              onPress={async () => {
                try {
                  const response = await fetch('/api/notifications/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'in_app' }),
                  });
                  if (response.ok) {
                    // Show success message
                  }
                } catch (error) {
                  console.error('Error sending test notification:', error);
                }
              }}
            >
              Test In-App
            </Button>
            <Button
              color="secondary"
              variant="flat"
              onPress={async () => {
                try {
                  const response = await fetch('/api/notifications/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'push' }),
                  });
                  if (response.ok) {
                    // Show success message
                  }
                } catch (error) {
                  console.error('Error sending test notification:', error);
                }
              }}
              isDisabled={!isSubscribed}
            >
              Test Push
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
