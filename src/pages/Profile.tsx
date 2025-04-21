
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileCard from "@/components/ProfileCard";
import Loader from "@/components/ui/loader";
import ProfileEditor from "@/components/ProfileEditor";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Edit, Check, User, Settings, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RecentActivity from "@/components/profile/RecentActivity";
import Achievements from "@/components/profile/Achievements";
import LeaderboardPosition from "@/components/profile/LeaderboardPosition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePlayerStats } from "@/hooks/usePlayerStats";

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  // Optimistic profile state
  const [optimisticProfile, setOptimisticProfile] = useState<any>(null);
  const { stats, statsLoading, statsError } = usePlayerStats(user?.id);

  // React Query: fetch profile
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Use profileData as the source of truth unless optimistic update is present
  const currentProfile = optimisticProfile || profileData;
  const loading = profileLoading;

  // Set bio from profileData when fetched
  useEffect(() => {
    if (profileData && typeof profileData === 'object' && profileData !== null) {
      setProfile(profileData);
      setBio((profileData as any).bio || "");
    }
  }, [profileData]);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("");


  // Player stats
  const [playerStats, setPlayerStats] = useState({
    battles: 0,
    wins: 0,
    winRate: 0,
    longestStreak: 0,
    lastBattle: undefined,
    averageScore: 0
  });

  // Recent activity
  const [recentActivities, setRecentActivities] = useState([]);

  // Achievements 
  const [achievements, setAchievements] = useState([]);

  // Leaderboard position
  const [leaderboardStats, setLeaderboardStats] = useState({
    position: undefined,
    totalPlayers: 0,
    topPercentage: undefined
  });



  useEffect(() => {
    if (!user) return;


    // Fetch player stats
    const fetchPlayerStats = async () => {
      try {
        // Get battles and wins count for the user
        const { data: battleData, error: battleError } = await supabase
          .from('battle_participants')
          .select('battle_id')
          .eq('user_id', user.id);

        if (battleError) throw battleError;

        const battlesCount = battleData?.length || 0;

        // Get wins data
        const { data: winData, error: winError } = await supabase
          .from('votes')
          .select('score')
          .eq('voted_for_id', user.id);

        if (winError) throw winError;

        // Calculate wins - this is simplified, but you'd need to define what a 'win' is
        // For this example, let's say a win is when a user got votes
        const winsCount = winData?.length || 0;

        // Calculate win rate
        const winRate = battlesCount > 0 ? Math.round((winsCount / battlesCount) * 100) : 0;

        // Get average score
        let averageScore = 0;
        if (winData && winData.length > 0) {
          const totalScore = winData.reduce((sum, vote) => sum + vote.score, 0);
          averageScore = totalScore / winData.length;
        }

        // For now, these are placeholders - you would fetch actual data
        setPlayerStats({
          battles: battlesCount,
          wins: winsCount,
          winRate: winRate,
          longestStreak: 0, // You would calculate this based on consecutive wins
          lastBattle: undefined, // You would get this from the most recent battle
          averageScore: averageScore
        });

        // Also update the profile card stats
        setLeaderboardStats({
          position: undefined, // You would get this from leaderboard ranking
          totalPlayers: 0,     // Total number of players in the system
          topPercentage: undefined // Calculate based on position and total players
        });

        // For recent activities, you'd fetch actual battles/achievement data
        setRecentActivities([]);

        // For achievements, you would define criteria and fetch progress
        setAchievements([]);

      } catch (error) {
        console.error("Error fetching player stats:", error);
        toast.error("Could not load player statistics");
      } finally {
        // No setStatsLoading -- removed to fix undefined error
      }
    };

    fetchPlayerStats();
  }, [user, profile]);


  // Optimistic profile editing (keep for instant UI feedback)
  // (already declared at top, remove this duplicate)

  const [optimisticError, setOptimisticError] = useState<string | null>(null);

// Centralized profile update handler (optimistic UI)
const handleProfileUpdate = async (updates: any) => {
    setOptimisticError(null);
    const prevProfile = { ...profile };
    setOptimisticProfile({ ...profile, ...updates });
    setProfile((p: any) => ({ ...p, ...updates }));
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      setOptimisticProfile(null);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      setOptimisticProfile(null);
      setProfile(prevProfile);
      setOptimisticError(err?.message || 'Failed to update profile');
      toast.error('Failed to update profile: ' + (err?.message || 'Unknown error'));
    }
    setIsSaving(false);
  };

  // Avatar upload callback (update avatar in parent state)
  const handleAvatarUpdated = (avatar_url: string) => {
    setProfile((prev: any) => ({ ...prev, avatar_url }));
  };

  // Validation helpers
  const validateProfile = (fields: any) => {
    if (!fields.username || fields.username.length < 3) return 'Username must be at least 3 characters.';
    if (!fields.email || !/^[^@]+@[^@]+\.[^@]+$/.test(fields.email)) return 'Please enter a valid email.';
    if (fields.bio && fields.bio.length > 160) return 'Bio must be less than 160 characters.';
    return null;
  };

  

  if (statsError) {
    return <div className="text-red-500">Could not load player statistics: {statsError.message}</div>;
  }
  return (
    <div className="neo-container py-8 animate-fade-in">
      <h1 className="text-3xl font-black mb-8 text-white">Your Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard
            loading={profileLoading}
            avatarUrl={currentProfile?.avatar_url}
            username={currentProfile?.username ?? "Unknown User"}
            bio={currentProfile?.bio}
            email={currentProfile?.email || user?.email}
            stats={{
              battles: playerStats?.battles,
              wins: playerStats?.wins,
              winRate: playerStats?.winRate,
              longestStreak: playerStats?.longestStreak,
            }}
            onAvatarUpdated={handleAvatarUpdated}
          />
          <LeaderboardPosition
            loading={statsLoading}
            position={leaderboardStats.position}
            totalPlayers={leaderboardStats.totalPlayers}
            topPercentage={leaderboardStats.topPercentage}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full bg-night-800 border-2 border-black mb-6">
              <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black text-night-500">
                Profile
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black text-night-500">
                Activity
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black text-night-500">
                Achievements
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-6 mt-0 animate-fade-in">
              <ProfileEditor
                avatarUrl={currentProfile?.avatar_url}
                username={currentProfile?.username || user?.email?.split("@")?.[0] || "User"}
                bio={currentProfile?.bio}
                email={currentProfile?.email || user?.email}
                loading={loading}
                isSaving={isSaving}
                error={optimisticError}
                onProfileUpdated={async (updates) => {
                  const validationError = validateProfile(updates);
                  if (validationError) {
                    setOptimisticError(validationError);
                    toast.error(validationError);
                    return;
                  }
                  setIsSaving(true);
                  await handleProfileUpdate(updates);
                }}
              />
            </TabsContent>
            <TabsContent value="activity" className="space-y-6 mt-0 animate-fade-in">
              <RecentActivity
                loading={statsLoading}
                activities={recentActivities || []}
              />
            </TabsContent>
            <TabsContent value="achievements" className="mt-0 animate-fade-in">
              <Achievements
                loading={statsLoading}
                achievements={achievements || []}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
