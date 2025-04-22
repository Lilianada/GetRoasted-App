
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trophy, User, Flame, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';

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
        
        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="space-y-1 pr-3">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
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
                          onClick={() => handleNotificationAction(notification)}
                        >
                          View Details
                        </Button>
                      )}
                      
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 ml-auto text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
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
