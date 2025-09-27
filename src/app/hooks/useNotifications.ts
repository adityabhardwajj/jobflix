'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Notification as NotificationType, NotificationFilters, NotificationStats } from '@/app/types/notifications';

export function useNotifications(filters: NotificationFilters = {}) {
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      const response = await apiClient.getNotifications({
        page: 1,
        limit: 50,
        unread_only: filters.is_read === false
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return (response.data as any)?.data || [];
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Fetch notification stats
  const { data: stats } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: async () => {
      const response = await apiClient.getNotifications({ page: 1, limit: 1 });
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Calculate stats from notifications
      const allNotifications = (response.data as any)?.data || [];
      const unreadCount = allNotifications.filter((n: any) => !n.is_read).length;
      
      return {
        total: allNotifications.length,
        unread: unreadCount,
        by_type: allNotifications.reduce((acc: Record<string, number>, n: any) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        }, {})
      } as NotificationStats;
    },
    staleTime: 30000,
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.markNotificationAsRead(notificationId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.markAllNotificationsAsRead();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  // Actions
  const markAsRead = useCallback((notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  return {
    notifications: notifications || [],
    stats: stats || { total: 0, unread: 0, by_type: {} },
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}

// Hook for notification badge count
export function useNotificationBadge() {
  const { stats } = useNotifications();
  return stats.unread;
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Try WebSocket first, fallback to EventSource
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;
    
    let connection: WebSocket | EventSource | null = null;

    const connect = () => {
      try {
        // Try WebSocket
        connection = new WebSocket(wsUrl);
        
        connection.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };

        connection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'notification.created') {
              // Invalidate notifications to refetch
              queryClient.invalidateQueries({ queryKey: ['notifications'] });
              queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
              
              // Show browser notification if permission granted
              if (Notification.permission === 'granted' && data.notification) {
                new Notification(data.notification.title, {
                  body: data.notification.message,
                  icon: '/favicon.svg',
                  tag: data.notification.id,
                });
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        connection.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Reconnect after 5 seconds
          setTimeout(connect, 5000);
        };

        connection.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          
          // Fallback to EventSource
          if (connection) {
            connection.close();
          }
          
          const eventSourceUrl = `${window.location.origin}/api/notifications/stream`;
          connection = new EventSource(eventSourceUrl);
          
          connection.onopen = () => {
            console.log('EventSource connected');
            setIsConnected(true);
          };

          connection.addEventListener('notification.created', (event) => {
            try {
              const data = JSON.parse(event.data);
              queryClient.invalidateQueries({ queryKey: ['notifications'] });
              queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
            } catch (error) {
              console.error('Error parsing EventSource message:', error);
            }
          });

          connection.onerror = () => {
            console.error('EventSource error');
            setIsConnected(false);
            // Retry connection
            setTimeout(connect, 10000);
          };
        };
      } catch (error) {
        console.error('Failed to establish real-time connection:', error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, [queryClient]);

  return { isConnected };
}
