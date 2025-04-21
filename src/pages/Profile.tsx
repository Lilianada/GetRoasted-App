import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileCard from "@/components/ProfileCard";
import Loader from "@/components/ui/loader";

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="neo-container py-12">
      <ProfileCard
        loading={loading}
        avatarUrl={profile?.avatar_url}
        username={profile?.username || user?.email?.split("@")[0] || "User"}
        bio={profile?.bio}
      />
      {/* ...Further profile content/actions can go here... */}
    </div>
  );
};

export default Profile;
