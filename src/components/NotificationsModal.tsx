
import { useState, useEffect } from 'react';
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
import { Bell, Check, Calendar, Trophy, User, Flame, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'battle_invite' | 'battle_start' | 'battle_end' | 'leaderboard' | 'account' | 'general';
  action_url?: string;
}

interface NotificationsModalProps {
  children?: React.ReactNode;
}

const NotificationsModal = ({ children }: NotificationsModalProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();
  
  // Mock notifications for now - in a real implementation, you would fetch from the database
  const mockNotifications: Notification[] = [
    {
      id: "1",
      user_id: user?.id || "",
      title: "Battle Invitation",
      message: "RoastMaster has invited you to a battle!",
      read: false,
      created_at: new Date().toISOString(),
      type: 'battle_invite',
      action_url: "/battle/join/123"
    },
    {
      id: "2",
      user_id: user?.id || "",
      title: "Your Battle is Starting",
      message: "Your battle with ComebackKing is about to begin!",
      read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'battle_start',
      action_url: "/battle/live/456"
    }
  ];
  
  useEffect(() => {
    if (!user) return;
    
    // For the temporary implementation, use the mock data
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    
    /* Real implementation would be something like:
    const fetchNotifications = async () => {
      try {
        // This assumes you have a notifications table in your database
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.read).length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to new notifications for real-time updates
    const channel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notification
          toast.info(newNotification.title, {
            description: newNotification.message,
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
    */
  }, [user]);
  
  const markAsRead = async (id: string) => {
    // In a real implementation, you would update the database
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    /* Real implementation would be something like:
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    */
  };
  
  const markAllAsRead = async () => {
    if (notifications.length === 0) return;
    
    // In a real implementation, you would update the database
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
    
    /* Real implementation would be something like:
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Failed to mark all as read");
    }
    */
  };
  
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
      <DialogContent className="flame-card sm:max-w-md max-h-[80vh] flex flex-col">
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
            {notifications.length > 0 ? (
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
                          onClick={() => {
                            markAsRead(notification.id);
                            setOpen(false);
                            window.location.href = notification.action_url!;
                          }}
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
