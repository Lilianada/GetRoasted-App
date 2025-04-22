import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';
import NotificationsList from './NotificationsList';
import TestNotificationButton from './TestNotificationButton';

interface NotificationsModalProps {
  children?: React.ReactNode;
}

const NotificationsModal = ({ children }: NotificationsModalProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  } = useNotifications();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const handleNotificationAction = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
    
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };
  
  // Custom trigger if children are provided, otherwise use default
  const triggerElement = children ? (
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={markAllAsRead}
              >
                <Check className="h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Stay updated on battle invites and account activities
          </DialogDescription>
        </DialogHeader>
        
        <NotificationsList 
          notifications={notifications}
          isLoading={isLoading}
          markAsRead={markAsRead}
          handleNotificationAction={handleNotificationAction}
          formatDate={formatDate}
        />
        
        <div className="flex justify-center pt-2">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
