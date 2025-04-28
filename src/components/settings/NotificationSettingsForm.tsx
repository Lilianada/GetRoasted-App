
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

export function NotificationSettingsForm() {
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [Notifications, setNotifications] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuthContext();

  React.useEffect(() => {
    if (!user) return;
    
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email_notifications, _notifications')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setEmailNotifications(data?.email_notifications ?? false);
        setNotifications(data?._notifications ?? true);
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      }
    };

    fetchPreferences();
  }, [user]);

  const updatePreference = async (key: string, value: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Notification settings updated");
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error("Failed to update settings");
      // Revert the local state if the update failed
      if (key === 'email_notifications') setEmailNotifications(!value);
      if (key === '_notifications') setNotifications(!value);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email alerts for battle invites and important updates
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          disabled={isLoading}
          onCheckedChange={(checked) => {
            setEmailNotifications(checked);
            updatePreference('email_notifications', checked);
          }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="-notifications"> Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Play  when new notifications arrive
          </p>
        </div>
        <Switch
          id="-notifications"
          checked={Notifications}
          disabled={isLoading}
          onCheckedChange={(checked) => {
            setNotifications(checked);
            updatePreference('_notifications', checked);
          }}
        />
      </div>
    </div>
  );
}
