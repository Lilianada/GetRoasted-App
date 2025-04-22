
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePlayerStats(userId: string | null | undefined) {
  const [stats, setStats] = useState({
    battles: 0,
    wins: 0,
    winRate: 0,
    avgScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setStats({
            battles: data.battles_count || 0,
            wins: data.wins_count || 0,
            winRate: data.win_rate || 0,
            avgScore: data.average_score || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, isLoading };
}
