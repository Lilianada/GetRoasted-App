
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

import type { Notification } from '@/types/notification';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.id) return;
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to fetch notifications');
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount((data as Notification[]).filter((n) => !n.read).length);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);
    if (error) {
      toast.error('Failed to mark all as read');
      return;
    }
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Notifications
        </h2>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={markAllAsRead}>
            Mark all as read <Badge>{unreadCount}</Badge>
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-md border ${notification.read ? 'bg-night-900 border-night-700' : 'bg-night-800 border-flame-500'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-white'}`}>{notification.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{new Date(notification.created_at).toLocaleString()}</span>
              </div>
              {notification.action_url && (
                <Button variant="link" size="sm" className="h-auto p-0 text-flame-500 mt-1" onClick={() => window.location.href = notification.action_url!}>
                  View Details
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
