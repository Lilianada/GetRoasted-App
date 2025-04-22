
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AccountSettings from "./AccountSettings";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Mail } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Enable Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive updates about battles and mentions
          </p>
        </div>
        <Switch 
          checked={notificationsEnabled} 
          onCheckedChange={setNotificationsEnabled} 
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <Separator className="bg-night-700" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base">Email Notifications</Label>
          </div>
          <Switch 
            checked={emailNotifications} 
            onCheckedChange={setEmailNotifications}
            disabled={!notificationsEnabled}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base">In-App Notifications</Label>
          </div>
          <Switch 
            checked={inAppNotifications} 
            onCheckedChange={setInAppNotifications}
            disabled={!notificationsEnabled}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </section>
  );
}

export { AccountSettings };

export function AppearanceSettings() {
  const { darkMode, toggleDarkMode, soundEnabled, toggleSound } = useSettings();

  return (
    <section className="space-y-6">
      <Separator className="bg-night-700" />
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Sound Effects</Label>
          <p className="text-sm text-muted-foreground">
            Play sounds during battles
          </p>
        </div>
        <Switch 
          checked={soundEnabled} 
          onCheckedChange={toggleSound} 
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </section>
  );
}
