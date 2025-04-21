import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePlayerStats(userId?: string) {
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    setStatsLoading(true);
    supabase
      .from('leaderboard')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) setStatsError(error);
        else setStats(data);
      })
      .finally(() => setStatsLoading(false));
  }, [userId]);

  return { stats, statsLoading, statsError };
}
