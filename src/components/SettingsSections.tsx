
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const NotificationSettings = () => {
  const { user } = useAuthContext();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Set default values if the fields don't exist
        setEmailNotifications(data?.email_notifications ?? false);
        setSoundNotifications(data?.sound_notifications ?? true);
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
      if (key === 'sound_notifications') setSoundNotifications(!value);
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
          <Label htmlFor="sound-notifications">Sound Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Play sound when new notifications arrive
          </p>
        </div>
        <Switch
          id="sound-notifications"
          checked={soundNotifications}
          disabled={isLoading}
          onCheckedChange={(checked) => {
            setSoundNotifications(checked);
            updatePreference('sound_notifications', checked);
          }}
        />
      </div>
    </div>
  );
};

export const AppearanceSettings = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Display settings will be available in a future update.
      </p>
    </div>
  );
};

export const AccountSettings = () => {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      
      toast.success("Account deleted successfully");
      signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-night-800 border-night-700">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Account</DialogTitle>
          <DialogDescription>  
            This action cannot be undone. This will permanently delete your account
            and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            To confirm, type <span className="font-bold text-destructive">DELETE</span> in the field below:
          </p>
          <Input
            className="border-night-700"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmation !== "DELETE" || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
