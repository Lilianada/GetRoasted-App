
import { useState, useEffect } from "react";
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
import ProfileStats from "@/components/profile/ProfileStats";
import RecentActivity from "@/components/profile/RecentActivity";
import Achievements from "@/components/profile/Achievements";
import LeaderboardPosition from "@/components/profile/LeaderboardPosition";
import FancyDialog from "@/components/ui/FancyDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    if (!user) return;
    setStatsLoading(true);

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

        // For recent activities, you'd fetch actual battle/achievement data
        setRecentActivities([]);

        // For achievements, you would define criteria and fetch progress
        setAchievements([]);

      } catch (error) {
        console.error("Error fetching player stats:", error);
        toast.error("Could not load player statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchPlayerStats();
  }, [user, profile]);


  return (
    <div className="neo-container py-8 animate-fade-in">
      <h1 className="text-3xl font-black mb-8 text-white">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <ProfileCard
            loading={loading}
            avatarUrl={profile?.avatar_url}
            username={profile?.username || user?.email?.split("@")[0] || "User"}
            bio={profile?.bio}
            email={user?.email}
            stats={{
              battles: playerStats.battles,
              wins: playerStats.wins,
              winRate: playerStats.winRate,
              longestStreak: playerStats.longestStreak,
            }}
          />
          {/* Edit Profile Button */}
          <div className="flex items-center gap-2 w-full justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsEditing(!isEditing)}
              className="border-2 border-black"
            >
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            </div>

          {/* Leaderboard Position Card */}
          <LeaderboardPosition
            loading={statsLoading}
            position={leaderboardStats.position}
            totalPlayers={leaderboardStats.totalPlayers}
            topPercentage={leaderboardStats.topPercentage}
          />

          </div>

          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="w-full bg-night-800 border-2 border-black mb-6">
                <TabsTrigger value="activity" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-black">
                  Achievements
                </TabsTrigger>
              </TabsList>

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
