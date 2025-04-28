
import React, { useEffect, useRef } from 'react';

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import NotificationsModal from "@/components/notifications/NotificationsModal";
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

const FloatingNotificationBell = () => {
  const { unreadCount } = useNotifications();
  const prevUnreadCount = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {

    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  if (unreadCount === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <NotificationsModal>
        <Button 
          size="icon"
          className={cn(
            "rounded-full h-12 w-12 shadow-lg transition-all",
            "hover:scale-105 animate-bounce-slow",
            "bg-night-800 border-2",
            unreadCount > 0 && "border-red-500 shadow-red-500/20"
          )}
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </NotificationsModal>
    </div>
  );
};

export default FloatingNotificationBell;
