
import { useNotificationsQuery } from './useNotificationsQuery';
import { useNotificationActions } from './useNotificationActions';
import { useSettings } from './useSettings';
import { playNotificationSound } from '@/utils/notificationSound';

export function useNotifications() {
  const { notifications, isLoading } = useNotificationsQuery();
  const { markAsRead, markAllAsRead } = useNotificationActions();
  const { soundEnabled } = useSettings();
  
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
