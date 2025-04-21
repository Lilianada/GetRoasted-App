
import { useQuery } from "@tanstack/react-query";
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

const fetchLeaderboard = async () => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("win_rate", { ascending: false });
  if (error) throw error;
  return data as LeaderboardEntry[];
};

const Leaderboard = () => {
  const { data: entries, isLoading, isError, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  return (
    <div className="neo-container py-8">
      <h1 className="text-3xl mb-6">🔥 Leaderboard</h1>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader size="large" variant="colorful" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load leaderboard.<br />
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="neo-grid">
          {entries.map((entry, idx) => (
            <Card
              key={entry.id}
              className={`bg-white border-2 border-black text-night-900 shadow-neo ${idx < 3 ? "border-yellow-500" : ""}`}
              aria-label={`Rank ${idx + 1}: ${entry.username}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-2xl font-bold w-8 text-center">
                  {idx + 1}
                </div>
                <img
                  src={entry.avatar_url || "/placeholder.svg"}
                  className="w-12 h-12 rounded-full border-2 border-yellow object-cover"
                  alt={entry.username}
                  loading="lazy"
                />
                <div>
                  <div className="font-bold text-lg flex items-center gap-1">
                    {entry.username}
                    {idx === 0 && <span title="1st Place" role="img" aria-label="gold medal">🥇</span>}
                    {idx === 1 && <span title="2nd Place" role="img" aria-label="silver medal">🥈</span>}
                    {idx === 2 && <span title="3rd Place" role="img" aria-label="bronze medal">🥉</span>}
                  </div>
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
      ) : (
        <div className="text-center text-night-400 py-8">
          No leaderboard entries yet. Be the first to battle!
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
