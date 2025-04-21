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

        setProfileData({
          id: profileData.id,
          username: profileData.username,
          avatar_url: profileData.avatar_url,
          email: user.email,
          bio: profileData.bio,
          created_at: profileData.created_at
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

  const handleSaveProfile = (updatedData: { username: string, bio: string }) => {
    if (!profileData) return;

    setProfileData(prev => prev ? { ...prev, username: updatedData.username, bio: updatedData.bio } : null);
    setIsEditing(false);
  };


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
          username: profileData.username,
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
      <div className="min-h-screen bg-night flex flex-col">

        <div className="container flex-1 py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <main className="container flex-1 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className=" mb-6 border-night-700 overflow-visible">
            <CardContent className="p-6">
              {isEditing ? (
                <div className="flex flex-col gap-6 items-center md:items-start w-full">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-flame-500">
                      <AvatarImage src={profileData.avatar_url} alt={profileData.username} />
                      <AvatarFallback className="bg-night-700 text-flame-500 text-xl">
                        {profileData.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Card className="border-night-700 w-full max-w-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        Account Settings
                      </CardTitle>
                      <CardDescription>
                        Edit your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Display Name</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={handleInputChange}
                          className="border-night-700 focus-visible:ring-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                          This is how you'll appear in battles and on the leaderboard.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          type="email"
                          disabled
                          className="border-night-700 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          className="border-night-700 focus-visible:ring-primary min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tell others about your roasting style in 160 characters or less.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-night-700 pt-6 flex gap-2">
                      <Button
                        className="bg-yellow hover:opacity-90"
                        onClick={handleSaveSettings}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col gap-6 items-center md:items-start w-full">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-flame-500">
                      <AvatarImage src={profileData.avatar_url} alt={profileData.username} />
                      <AvatarFallback className="bg-night-700 text-flame-500 text-xl">
                        {profileData.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -right-2 -bottom-2 h-7 w-7 rounded-full bg-primary border-night-700"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Card className="border-night-700 w-full max-w-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        Account Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="mb-2">
                        <Label>Display Name</Label>
                        <div className="font-medium text-lg">{profileData.username}</div>
                      </div>
                      <div className="mb-2">
                        <Label>Email</Label>
                        <div className="text-muted-foreground">{profileData.email}</div>
                      </div>
                      <div className="mb-2">
                        <Label>Bio</Label>
                        <div className="text-muted-foreground whitespace-pre-line">{profileData.bio || <span className="italic">No bio set.</span>}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold">{profileData.username}</h1>
                <Badge variant="default" className="w-fit mx-auto md:mx-0">
                  Top Roaster
                </Badge>
              </div>

              <div className="mt-2 flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                {profileData.email && (
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 justify-center md:justify-start">
                </div>
                <Card className="border-night-700 w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="mb-2">
                      <Label>Display Name</Label>
                      <div className="font-medium text-lg">{profileData.username}</div>
                    </div>
                    <div className="mb-2">
                      <Label>Email</Label>
                      <div className="text-muted-foreground">{profileData.email}</div>
                    </div>
                    <div className="mb-2">
                      <Label>Bio</Label>
                      <div className="text-muted-foreground whitespace-pre-line">{profileData.bio || <span className="italic">No bio set.</span>}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          <div className=" mb-6 border-night-700 overflow-visible">

            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl font-bold">{profileData.username}</h1>
              <Badge variant="default" className="w-fit mx-auto md:mx-0">
                Top Roaster
              </Badge>
            </div>

            <div className="mt-2 flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
              {profileData.email && (
                <div className="flex items-center gap-1 justify-center md:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.email}</span>
                </div>
              )}
              <div className="flex items-center gap-1 justify-center md:justify-start">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profileData.created_at)}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center rounded-md bg-primary border px-2 py-2">
                <span className="text-2xl font-bold text-flame-500">{stats?.wins}</span>
                <span className="text-xs text-muted-foreground">Wins</span>
              </div>
              <div className="flex flex-col items-center rounded-md bg-primary border px-2 py-2">
                <span className="text-2xl font-bold text-ember-500">{stats?.losses}</span>
                <span className="text-xs text-muted-foreground">Losses</span>
              </div>
              <div className="flex flex-col items-center rounded-md bg-primary border px-2 py-2">
                <span className="text-2xl font-bold text-secondary">{stats?.winRate}%</span>
                <span className="text-xs text-muted-foreground">Win Rate</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Tabs className="space-y-5">
        <TabsList className="bg-night-800 border border-night-700 w-full md:w-auto">
          <TabsTrigger value="details" className="data-[state=active]:bg-flame-600">
            User Details
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-flame-600">
            Battle Stats
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-flame-600">
            Battle History
          </TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-flame-600">
            Badges
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <Card className=" border-night-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                  <p>{profileData.bio || "No bio provided yet. Click the edit button on your profile to add one!"}</p>
                </div>
                {stats && (
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Roasting Style</h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm">Savagery</label>
                          <span className="text-xs font-mono">{stats.savageryRating}%</span>
                        </div>
                        <Progress value={stats.savageryRating} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm">Creativity</label>
                          <span className="text-xs font-mono">{stats.creativityRating}%</span>
                        </div>
                        <Progress value={stats.creativityRating} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm">Humor</label>
                          <span className="text-xs font-mono">{stats.humorRating}%</span>
                        </div>
                        <Progress value={stats.humorRating} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats" className="mt-6">
          <Card className=" border-night-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Battle Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Battle Summary</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Total Battles</span>
                        <span className="font-mono">{stats?.totalBattles}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Win Rate</span>
                        <span className="font-mono">{stats?.winRate}%</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Average Score</span>
                        <span className="font-mono">{stats?.avgScore} / 10</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Highest Score</span>
                        <span className="font-mono">{stats?.highestScore} / 10</span>
                      </li>
                    </ul>
                  </div>
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Ranking</h3>
                    <div className="flex items-center gap-2">
                      <div className="bg-flame-600/20 text-flame-500 p-2 rounded-full">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">Top 5%</div>
                        <div className="text-xs text-muted-foreground">Global Ranking</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Score Distribution</h3>
                  <div className="h-64 flex items-end justify-around gap-2">
                    {[45, 68, 90, 75, 60, 30, 20, 10, 5, 2].map((value, i) => (
                      <div key={i} className="flex-1">
                        <div
                          className="bg-gradient-to-t from-flame-700 to-flame-500 rounded-t"
                          style={{ height: `${value * 0.6}%` }}
                        ></div>
                        <div className="text-xs text-center mt-1">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-center mt-2 text-muted-foreground">Score Rating (1-10)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card className=" border-night-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Battles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBattles.map((battle) => (
                  <div
                    key={battle.id}
                    className="group flex items-center justify-between p-3 rounded-lg bg-night-800 hover:bg-night-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${battle.result === "win" ? "bg-flame-600/20 text-flame-500" : "bg-ember-600/20 text-ember-500"
                        }`}>
                        {battle.result === "win" ? (
                          <Trophy className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          vs. <span className={battle.result === "win" ? "text-flame-500" : ""}>{battle.opponent}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{battle.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">{battle.score}</div>
                      <div className="text-xs text-muted-foreground capitalize">{battle.result}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-night-700">
                  View All Battles
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="badges" className="mt-6">
          <Card className=" border-night-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Earned Badges
              </CardTitle>
              <CardDescription>Badges earned through exceptional roasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="glass-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-night-700 flex items-center justify-center mb-3">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <h3 className="font-medium mb-1">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-night-700 pt-4">
                <h3 className="text-sm font-medium mb-3">Locked Badges</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center opacity-60">
                    <div className="h-12 w-12 rounded-full bg-night-700 flex items-center justify-center mb-3">
                      <Shield className="h-4 w-4 text-gray-400" />
                    </div>
                    <h3 className="font-medium mb-1">Unbreakable</h3>
                    <p className="text-xs text-muted-foreground">Win 20 battles without losing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;