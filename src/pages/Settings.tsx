import { useState, useEffect } from "react";


import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Trash2,
  Mail,
  MessageSquare,
  User,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

import { NotificationSettings, AccountSettings, AppearanceSettings } from "@/components/SettingsSections";

const Settings = () => {
  // State is now managed in respective section components

  
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    bio: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuthContext();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, bio')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfileData({
          displayName: data?.username || '',
          email: user.email || '',
          bio: data?.bio || ''
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data');
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error("You need to be logged in to save settings");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.displayName,
          bio: profileData.bio,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Settings saved", {
        description: "Your preferences have been updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Confirmation text doesn't match");
      return;
    }
    
    try {
      const response = await fetch('/api/delete-account', { method: 'POST', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to delete account securely');
      // Log out user, redirect, etc.
      // In a real implementation, you would call a secure server function to delete the account
      if (user) {
        await signOut();
      }
      
      toast.error("Account deleted", {
        description: "Your account has been permanently deleted.",
      });
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      

      
      <main className="container flex-1 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <div className="grid gap-6">
           

            <Card className=" border-night-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {/* <Bell className="h-5 w-5" /> */}
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                      {/* <Mail className="h-4 w-4 text-muted-foreground" /> */}
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
              </CardContent>
            </Card>

            <Card className=" border-night-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {/* <Moon className="h-5 w-5" /> */}
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between dark and light theme
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <Separator className="bg-night-700" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds during battles
                    </p>
                  </div>
                  <Switch 
                    checked={soundEffects} 
                    onCheckedChange={setSoundEffects} 
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-night-700 pt-6">
                <Button 
                  className="bg-yellow hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-night-800 border-destructive/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-card">
                  Irreversible actions that affect your account
                </CardDescription>
              </CardHeader>
                {/* DIALOG CONFIRMATION */}
              <CardContent>
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
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== "DELETE"}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
