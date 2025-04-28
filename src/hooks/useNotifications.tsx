
import { useNotificationsQuery } from './useNotificationsQuery';
import { useNotificationActions } from './useNotificationActions';
import { useSettings } from './useSettings';
import { useState, useEffect } from 'react';

export function useNotifications() {
  const { notifications: remoteNotifications, isLoading } = useNotificationsQuery();
  const { markAsRead, markAllAsRead } = useNotificationActions();

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

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  };
}
