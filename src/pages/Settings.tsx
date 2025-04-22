
import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettingsCard from "@/components/settings/NotificationSettingsCard";
import AppearanceSettingsCard from "@/components/settings/AppearanceSettingsCard";
import AccountSettingsCard from "@/components/settings/AccountSettingsCard";

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
            <ProfileSettings
              displayName={profileData.displayName}
              email={profileData.email}
              bio={profileData.bio}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSave={handleSaveSettings}
            />

            <NotificationSettingsCard />

            <AppearanceSettingsCard onSave={handleSaveSettings} />

            <AccountSettingsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
