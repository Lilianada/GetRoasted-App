
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Loader from "@/components/ui/loader";
import { Card, CardContent } from "@/components/ui/card";

type LeaderboardEntry = {
  id: string;
  username: string;
  wins_count: number;
  battles_count: number;
  win_rate: number;
  average_score: number;
  avatar_url?: string;
};

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("leaderboard")
      .select("*")
      .order("win_rate", { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (error) {
          setEntries([]);
        } else if (data) {
          setEntries(data as LeaderboardEntry[]);
        }
      });
  }, []);

  return (
    <div className="neo-container py-8">
      <h1 className="text-3xl  mb-6 ">🔥 Leaderboard</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader size="large" variant="colorful" />
        </div>
      ) : (
        <div className="neo-grid">
          {entries.map(entry => (
            <Card key={entry.id} className="bg-white border-2 border-black text-night-900 shadow-neo">
              <CardContent className="p-4 flex items-center gap-4">
                <img
                  src={entry.avatar_url || "/placeholder.svg"}
                  className="w-12 h-12 rounded-full border-2 border-yellow object-cover"
                  alt={entry.username}
                />
                <div>
                  <div className="font-bold text-lg">{entry.username}</div>
                  <div className="text-xs text-night-300">
                    Wins: <span className="font-semibold">{entry.wins_count}</span> · 
                    Battles: <span className="font-semibold">{entry.battles_count}</span> · 
                    Win Rate: <span className="font-semibold">{Number(entry.win_rate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-night-400">
                    Avg Score: <span className="font-semibold">{Number(entry.average_score).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
