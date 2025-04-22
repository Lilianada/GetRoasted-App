
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
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Notification } from '@/types/notification';

const MAX_RECENT = 5;

const RecentNotificationsModal = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    
    // Fetch only the most recent notifications
    const fetchNotifications = async () => {
      // We need to cast the result to Notification[] because the database schema doesn't match exactly
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(MAX_RECENT);
      
      if (!error && data) {
        setNotifications(data as unknown as Notification[]);
        setUnreadCount((data as unknown as Notification[]).filter((n) => !n.read).length);
      }
    };
    
    fetchNotifications();

    // Real-time notifications subscription
    const channel = supabase
      .channel('notifications_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotification = payload.new as unknown as Notification;
          setNotifications((prev) => [newNotification, ...prev].slice(0, MAX_RECENT));
          setUnreadCount((prev) => prev + 1);
          // Play notification sound
          import('@/utils/notificationSound').then(({ playNotificationSound }) => playNotificationSound());
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, open]);

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);
      
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Recent Notifications</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={markAllAsRead}>
                <Check className="h-3 w-3" /> Mark all as read
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>Only your 5 most recent notifications are shown here.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-md flex flex-col ${notification.read ? 'bg-transparent' : 'bg-night-800'}`}>
                <div className="flex justify-between">
                  <div>
                    <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-white'}`}>{notification.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(notification.created_at).toLocaleString()}</span>
                </div>
                {notification.action_url && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-flame-500 mt-1" onClick={() => window.location.href = notification.action_url!}>
                    View Details
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
        <div className="flex justify-center pt-2">
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Close</Button>
          </DialogClose>
        </div>
        <div className="flex justify-center pt-2">
          <Button variant="link" size="sm" onClick={() => { setOpen(false); window.location.href = '/notifications'; }}>
            See all notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecentNotificationsModal;
