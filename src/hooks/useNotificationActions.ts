
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/context/AuthContext";

export function useNotificationActions() {
  // For test/demo notifications, dispatch a window event
  const addNotification = (notification: any) => {
    window.dispatchEvent(new CustomEvent('add-notification', { detail: notification }));
  }
  const { user } = useAuthContext();

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification',
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .filter('read', 'eq', false);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive'
      });
    }
  };

  return { markAsRead, markAllAsRead, addNotification };
}
