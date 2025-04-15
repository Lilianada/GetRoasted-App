
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Crown, Flame, Zap } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  score: number;
  wins: number;
  badge?: string;
  rank: number;
}

const Leaderboard = () => {
  const [period, setPeriod] = useState("week");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        { id: "1", username: "FlameThrow3r", avatar: "", score: 1285, wins: 47, rank: 1, badge: "legend" },
        { id: "2", username: "RoastMaster99", avatar: "", score: 1142, wins: 38, rank: 2 },
        { id: "3", username: "WittyComeback", avatar: "", score: 1098, wins: 41, rank: 3 },
        { id: "4", username: "BurnNotice", avatar: "", score: 945, wins: 32, rank: 4 },
        { id: "5", username: "SavageModeOn", avatar: "", score: 892, wins: 29, rank: 5, badge: "rising" },
        { id: "6", username: "QuipMaster", avatar: "", score: 867, wins: 27, rank: 6 },
        { id: "7", username: "ComebackKid", avatar: "", score: 823, wins: 25, rank: 7 },
        { id: "8", username: "VerbalAssassin", avatar: "", score: 791, wins: 23, rank: 8 },
        { id: "9", username: "FlameSpit", avatar: "", score: 775, wins: 24, rank: 9 },
        { id: "10", username: "RoastBeef", avatar: "", score: 742, wins: 20, rank: 10 },
      ]);
      setLoading(false);
    }, 500);
  }, [period]);

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "legend":
        return <Crown className="h-4 w-4 text-amber-400" />;
      case "rising":
        return <Zap className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-flame text-white";
    if (rank === 2) return "bg-night-600 text-white";
    if (rank === 3) return "bg-night-700 text-ember-400";
    return "bg-night-800 text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <NavBar />
      
      <main className="container flex-1 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-flame-500" />
              <h1 className="text-3xl font-bold gradient-text">Leaderboard</h1>
            </div>
            
            <Tabs defaultValue={period} onValueChange={setPeriod} className="w-auto">
              <TabsList className="bg-night-800 border border-night-700">
                <TabsTrigger value="today" className="data-[state=active]:bg-flame-600">
                  Today
                </TabsTrigger>
                <TabsTrigger value="week" className="data-[state=active]:bg-flame-600">
                  This Week
                </TabsTrigger>
                <TabsTrigger value="alltime" className="data-[state=active]:bg-flame-600">
                  All Time
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="relative h-12 w-12">
                <Flame className="h-12 w-12 text-flame-600 animate-flame-pulse" />
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 py-4 px-6 border-b border-night-700 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">Rank</div>
                <div className="col-span-7">User</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-2 text-right">Wins</div>
              </div>
              
              {users.map((user) => (
                <div 
                  key={user.id}
                  className="grid grid-cols-12 py-3 px-6 items-center border-b border-night-700/50 hover:bg-night-800/50 transition-colors"
                >
                  <div className="col-span-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${getRankStyle(user.rank)}`}>
                      {user.rank}
                    </div>
                  </div>
                  
                  <div className="col-span-7 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-night-700">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="bg-night-700 text-flame-500">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{user.username}</span>
                        {user.badge && getBadgeIcon(user.badge)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.wins} battles won
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 font-mono font-medium text-right">
                    {user.score.toLocaleString()}
                  </div>
                  
                  <div className="col-span-2 font-mono text-right">
                    {user.wins}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Leaderboards reset weekly. Earn points by winning battles and getting high ratings.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
