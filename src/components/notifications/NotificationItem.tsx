
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Check, Trophy, User, Flame } from "lucide-react";
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onAction: (notification: Notification) => void;
  formatDate: (dateString: string) => string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onAction, 
  formatDate 
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'battle_invite': return <Flame className="h-5 w-5 text-amber-500" />;
      case 'battle_start': return <Flame className="h-5 w-5 text-green-500" />;
      case 'battle_end': return <Trophy className="h-5 w-5 text-flame-500" />;
      case 'leaderboard': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'account': return <User className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      key={notification.id}
      className={`p-3 rounded-md flex gap-3 transition-colors ${
        notification.read ? 'bg-transparent' : 'bg-night-800'
      }`}
    >
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between gap-2">
          <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-white'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(notification.created_at)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <div className="flex justify-between items-center mt-2">
          {notification.action_url && (
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-flame-500" 
              onClick={() => onAction(notification)}
            >
              View Details
            </Button>
          )}
          
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 ml-auto text-xs"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
