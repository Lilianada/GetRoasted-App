
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
<<<<<<< HEAD
=======
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
>>>>>>> f6bf68a (Feat: Unifinished notifications logic)
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

import { NotificationSettings, AccountSettings, AppearanceSettings } from "@/components/SettingsSections";

const Settings = () => {
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    bio: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  
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

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <div className="grid gap-6">
            <Card className="border-night-700">
              <CardHeader>
                <CardTitle className="text-xl">Profile Information</CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={profileData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={profileData.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please contact support
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={profileData.bio} 
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about yourself"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-night-700 pt-6">
                <Button 
                  className="bg-yellow hover:opacity-90"
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-night-700">
              <CardHeader>
                <CardTitle className="text-xl">
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>

            <Card className="border-night-700">
              <CardHeader>
                <CardTitle className="text-xl">
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AppearanceSettings />
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

            <Card className="border-night-700">
              <CardHeader>
                <CardTitle className="text-xl">
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
<<<<<<< HEAD
                <AccountSettings />
=======
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
                        disabled={deleteConfirmation !== "DELETE"}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
>>>>>>> f6bf68a (Feat: Unifinished notifications logic)
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
