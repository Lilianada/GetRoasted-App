import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileCard from "@/components/ProfileCard";
import Loader from "@/components/ui/loader";
import ProfileEditor from "@/components/ProfileEditor";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Edit, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Could not load profile");
      } else {
        setProfile(data);
        setBio(data?.bio || "");
      }
      setLoading(false);
    };
    
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bio })
        .eq("id", user.id);
        
      if (error) throw error;
      
      setProfile({ ...profile, bio });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="neo-container py-8 animate-fade-in">
      <h1 className="text-3xl font-black mb-8 text-white">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileCard
            loading={loading}
            avatarUrl={profile?.avatar_url}
            username={profile?.username || user?.email?.split("@")[0] || "User"}
            bio={profile?.bio}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Details</h2>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isEditing ? "secondary" : "outline"} 
                      size="sm" 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      disabled={isSaving}
                      className="transition-all hover:scale-105"
                    >
                      {isEditing ? (
                        <>
                          {isSaving ? (
                            <Loader size="small" className="mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isEditing ? "Save your changes" : "Edit your profile"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {loading ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <Loader size="large" variant="colorful" />
              </div>
            ) : (
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 bg-night-700 border border-night-600 rounded-md focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 text-xs text-night-300">USERNAME</label>
                      <p className="text-lg font-medium">{profile?.username || user?.email?.split("@")[0] || "User"}</p>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-xs text-night-300">EMAIL</label>
                      <p className="text-lg font-medium">{user?.email || "No email available"}</p>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-xs text-night-300">BIO</label>
                      <p className="text-base">{profile?.bio || "No bio provided yet"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
          
          <Card className="p-6 bg-blue border-2 border-black text-black shadow-neo-lg relative overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Avatar</h2>
            
            {loading ? (
              <div className="min-h-[150px] flex items-center justify-center">
                <Loader size="large" variant="colorful" />
              </div>
            ) : (
              <ProfileEditor />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
