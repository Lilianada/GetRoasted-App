import { useState, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Clock,
  Trophy,
  Flame,
  Award,
  Zap,
  ThumbsUp,
  AlertTriangle,
  BarChart,
  Sword,
  Shield,
  Crown
} from "lucide-react";
import ProfileEditor from "@/components/ProfileEditor";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
  created_at?: string;
}

interface UserStats {
  wins: number;
  losses: number;
  winRate: number;
  totalBattles: number;
  avgScore: number;
  highestScore: number;
  savageryRating: number;
  creativityRating: number;
  humorRating: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface BattleHistory {
  id: string;
  opponent: string;
  result: "win" | "loss";
  date: string;
  score: string;
}

const getBadgeIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    sword: <Sword className="h-4 w-4 text-blue-400" />,
    flame: <Flame className="h-4 w-4 text-flame-500" />,
    "thumbs-up": <ThumbsUp className="h-4 w-4 text-green-400" />,
    zap: <Zap className="h-4 w-4 text-amber-400" />,
    crown: <Crown className="h-4 w-4 text-purple-400" />,
  };

  return icons[iconName] || <Award className="h-4 w-4 text-blue-400" />;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<{username: string, bio: string}>({username: '', bio: ''});
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentBattles, setRecentBattles] = useState<BattleHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const profile = {
          id: profileData.id,
          username: profileData.username,
          avatar_url: profileData.avatar_url,
          email: user.email,
          bio: profileData.bio,
          created_at: profileData.created_at
        };

        setProfileData(profile);
        setFormData({
          username: profile.username || '',
          bio: profile.bio || ''
        });

        setStats({
          wins: 47,
          losses: 12,
          winRate: 79,
          totalBattles: 59,
          avgScore: 8.7,
          highestScore: 9.8,
          savageryRating: 92,
          creativityRating: 87,
          humorRating: 76
        });

        setBadges([
          { id: "1", name: "Verbal Assassin", icon: "sword", description: "Won 10 consecutive battles" },
          { id: "2", name: "Flame Master", icon: "flame", description: "Received perfect scores in savagery" },
          { id: "3", name: "Crowd Favorite", icon: "thumbs-up", description: "Most liked roasts in a month" },
          { id: "4", name: "Quick Wit", icon: "zap", description: "Consistently quick responses" },
          { id: "5", name: "Champion Roaster", icon: "crown", description: "Top 1% of all roasters" }
        ]);

        setRecentBattles([
          { id: "b1", opponent: "SavageModeOn", result: "win", date: "2 days ago", score: "8.9 - 7.2" },
          { id: "b2", opponent: "QuipMaster", result: "win", date: "1 week ago", score: "9.3 - 8.5" },
          { id: "b3", opponent: "VerbalAssassin", result: "loss", date: "2 weeks ago", score: "7.8 - 8.9" },
          { id: "b4", opponent: "ComebackKid", result: "win", date: "3 weeks ago", score: "9.1 - 7.4" },
          { id: "b5", opponent: "RoastBeef", result: "win", date: "1 month ago", score: "8.7 - 7.9" }
        ]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error("You need to be logged in to save settings");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(prev => prev ? {
        ...prev,
        username: formData.username,
        bio: formData.bio
      } : null);

      setIsEditing(false);
      
      toast.success("Settings saved", {
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20">
        <Loader size="large" variant="colorful" />
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-900 via-night-800 to-night-900 flex flex-col">
      <main className="container flex-1 py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-night-800/60 shadow-neo-lg border-night-700 rounded-2xl transition-all duration-300 hover:shadow-neo p-0 mb-10 overflow-visible backdrop-blur-md">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-flame-500 bg-night-900 shadow-neo">
                      <AvatarImage src={profileData.avatar_url} alt={profileData.username} />
                      <AvatarFallback className="bg-night-700 text-flame-500 text-2xl">
                        {profileData.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-primary border-night-700 shadow-neo hover:bg-flame-500"
                      onClick={() => setIsEditing(!isEditing)}
                      aria-label="Edit profile"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-5 text-center">
                    <h1 className="text-2xl font-extrabold text-white">{profileData.username}</h1>
                    <Badge variant="default" className="mt-1 text-night-900 bg-primary shadow-neo">
                      Top Roaster
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <Card className="border-night-700 bg-night-900/95 rounded-xl shadow-neo p-0">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Edit Profile</CardTitle>
                        <CardDescription className="text-night-400">
                          Update your profile information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Display Name</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-night-800 text-white border-night-700 focus-visible:ring-primary"
                          />
                          <p className="text-xs text-muted-foreground">
                            This is how you'll appear in battles and on the leaderboard.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            className="bg-night-800 text-white border-night-700 focus-visible:ring-primary min-h-[100px]"
                          />
                          <p className="text-xs text-muted-foreground">
                            Tell others about your roasting style in 160 characters or less.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-night-700 pt-6 flex gap-2">
                        <Button
                          className="bg-primary text-black hover:opacity-90 shadow-neo"
                          onClick={handleSaveSettings}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader size="small" className="mr-2" /> : null}
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              username: profileData.username || '',
                              bio: profileData.bio || ''
                            });
                          }}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex flex-col md:flex-row gap-3 text-sm text-night-300">
                        {profileData.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{profileData.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {formatDate(profileData.created_at)}</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-night-200">Bio</Label>
                        <p className="mt-1 text-night-200">{profileData.bio || "No bio provided yet. Click the edit button to add one!"}</p>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div className="flex flex-col items-center rounded-lg bg-night-900 border border-night-700 px-3 py-3 shadow-neo">
                          <span className="text-3xl font-extrabold text-flame-400">{stats?.wins}</span>
                          <span className="text-xs text-night-400">Wins</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-night-900 border border-night-700 px-3 py-3 shadow-neo">
                          <span className="text-3xl font-extrabold text-ember-400">{stats?.losses}</span>
                          <span className="text-xs text-night-400">Losses</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-night-900 border border-night-700 px-3 py-3 shadow-neo">
                          <span className="text-3xl font-extrabold text-yellow">{stats?.winRate}%</span>
                          <span className="text-xs text-night-400">Win Rate</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-night-800 border border-night-700 rounded-lg shadow-neo w-full md:w-auto">
              <TabsTrigger value="details" className="data-[state=active]:bg-flame-600 data-[state=active]:text-white font-medium transition">
                User Details
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-flame-600 data-[state=active]:text-white font-medium transition">
                Battle Stats
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-flame-600 data-[state=active]:text-white font-medium transition">
                Battle History
              </TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-flame-600 data-[state=active]:text-white font-medium transition">
                Badges
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card className="bg-night-900/90 rounded-xl border-night-700 shadow-neo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="h-5 w-5" />
                    User Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-night-400 mb-3">Roasting Style</h3>
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm text-night-300">Savagery</label>
                            <span className="text-xs font-mono">{stats.savageryRating}%</span>
                          </div>
                          <Progress value={stats.savageryRating} className="h-2 bg-night-700" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm text-night-300">Creativity</label>
                            <span className="text-xs font-mono">{stats.creativityRating}%</span>
                          </div>
                          <Progress value={stats.creativityRating} className="h-2 bg-night-700" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm text-night-300">Humor</label>
                            <span className="text-xs font-mono">{stats.humorRating}%</span>
                          </div>
                          <Progress value={stats.humorRating} className="h-2 bg-night-700" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <Card className="bg-night-900/90 rounded-xl border-night-700 shadow-neo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart className="h-5 w-5" />
                    Battle Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-night-800 rounded-lg p-4 border border-night-700 shadow-neo">
                        <h3 className="text-sm font-medium text-night-400 mb-2">Battle Summary</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span className="text-sm text-night-300">Total Battles</span>
                            <span className="font-mono">{stats?.totalBattles}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-sm text-night-300">Win Rate</span>
                            <span className="font-mono">{stats?.winRate}%</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-sm text-night-300">Average Score</span>
                            <span className="font-mono">{stats?.avgScore} / 10</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-sm text-night-300">Highest Score</span>
                            <span className="font-mono">{stats?.highestScore} / 10</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-night-800 rounded-lg p-4 border border-night-700 shadow-neo">
                        <h3 className="text-sm font-medium text-night-400 mb-2">Ranking</h3>
                        <div className="flex items-center gap-2">
                          <div className="bg-flame-600/20 text-flame-500 p-2 rounded-full">
                            <Trophy className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">Top 5%</div>
                            <div className="text-xs text-night-400">Global Ranking</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-night-800 rounded-lg p-4 border border-night-700 shadow-neo flex flex-col justify-end">
                      <h3 className="text-sm font-medium text-night-400 mb-4">Score Distribution</h3>
                      <div className="h-64 flex items-end justify-around gap-2">
                        {[45, 68, 90, 75, 60, 30, 20, 10, 5, 2].map((value, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end">
                            <div
                              className="bg-gradient-to-t from-flame-700/90 to-flame-500 rounded-t shadow-md"
                              style={{ height: `${value * 0.6}%` }}
                            ></div>
                            <div className="text-xs text-center mt-1 text-night-400">{i + 1}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-center mt-2 text-night-400">Score Rating (1-10)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card className="bg-night-900/90 rounded-xl border-night-700 shadow-neo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5" />
                    Recent Battles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBattles.map((battle) => (
                      <div
                        key={battle.id}
                        className={`group flex items-center justify-between p-3 rounded-xl bg-night-800 border border-night-700 hover:bg-night-700/90 transition-colors shadow-neo-lg`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${battle.result === "win" ? "bg-flame-600/20 text-flame-500" : "bg-ember-600/20 text-ember-500"}`}>
                            {battle.result === "win" ? (
                              <Trophy className="h-5 w-5" />
                            ) : (
                              <AlertTriangle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${battle.result === "win" ? "text-flame-500" : "text-ember-500"}`}>
                              vs. {battle.opponent}
                            </div>
                            <div className="text-xs text-night-400">{battle.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-medium text-white">{battle.score}</div>
                          <div className="text-xs text-night-400 capitalize">{battle.result}</div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4 border-night-700 shadow-neo hover:bg-primary hover:text-night-900">
                      View All Battles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges" className="mt-6">
              <Card className="bg-night-900/90 rounded-xl border-night-700 shadow-neo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="h-5 w-5" />
                    Earned Badges
                  </CardTitle>
                  <CardDescription className="text-night-400">Badges earned through exceptional roasting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map((badge) => (
                      <div key={badge.id} className="bg-night-800 rounded-xl p-4 border border-night-700 flex flex-col items-center text-center shadow-neo">
                        <div className="h-12 w-12 rounded-full bg-night-700 flex items-center justify-center mb-3">
                          {getBadgeIcon(badge.icon)}
                        </div>
                        <h3 className="font-medium text-white mb-1">{badge.name}</h3>
                        <p className="text-xs text-night-400">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-night-700 pt-4">
                    <h3 className="text-sm font-medium mb-3 text-night-400">Locked Badges</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-night-800 rounded-xl p-4 border border-night-700 flex flex-col items-center text-center opacity-60 shadow-neo">
                        <div className="h-12 w-12 rounded-full bg-night-700 flex items-center justify-center mb-3">
                          <Shield className="h-4 w-4 text-gray-400" />
                        </div>
                        <h3 className="font-medium mb-1 text-white/60">Unbreakable</h3>
                        <p className="text-xs text-night-400">Win 20 battles without losing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
