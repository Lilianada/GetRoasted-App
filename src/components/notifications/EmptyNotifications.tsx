
import React from 'react';
import { Bell } from "lucide-react";

const EmptyNotifications: React.FC = () => {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
      <p>No notifications yet</p>
    </div>
  );
};

export default EmptyNotifications;
