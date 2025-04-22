
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";
import EmptyNotifications from "./EmptyNotifications";
import { Notification } from '@/types/notification';

interface NotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  markAsRead: (id: string) => void;
  handleNotificationAction: (notification: Notification) => void;
  formatDate: (dateString: string) => string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  isLoading,
  markAsRead,
  handleNotificationAction,
  formatDate,
}) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  if (!notifications.length) {
    return <EmptyNotifications />;
  }

  return (
    <ScrollArea className="flex-1 max-h-[60vh]">
      <div className="space-y-1 pr-3">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id}
            notification={notification} 
            onMarkAsRead={markAsRead}
            onAction={handleNotificationAction}
            formatDate={formatDate}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationsList;
