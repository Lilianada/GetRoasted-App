
import { useNotificationsQuery } from './useNotificationsQuery';
import { useNotificationActions } from './useNotificationActions';
import { useSettings } from './useSettings';
import { playNotificationSound } from '@/utils/notificationSound';

import { useState, useEffect } from 'react';

export function useNotifications() {
  const { notifications: remoteNotifications, isLoading } = useNotificationsQuery();
  const { markAsRead, markAllAsRead } = useNotificationActions();
  const { soundEnabled } = useSettings();

  // Local notifications for demo/testing
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      setLocalNotifications((prev) => [e.detail, ...prev]);
    };
    window.addEventListener('add-notification', handler);
    return () => window.removeEventListener('add-notification', handler);
  }, []);

  const notifications = [...localNotifications, ...remoteNotifications];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Play sound for new notifications if enabled
  if (soundEnabled && notifications.some(n => !n.read)) {
    playNotificationSound();
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  };
}
