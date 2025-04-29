
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RoastData } from '@/types/battle';

export function useBattleRoasts(battleId: string | undefined) {
  const [roasts, setRoasts] = useState<RoastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!battleId) {
      setIsLoading(false);
      return;
    }

    const fetchRoasts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('roasts')
          .select(`
            *,
            profiles:user_id(username, avatar_url)
          `)
          .eq('battle_id', battleId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setRoasts(data as RoastData[]);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching roasts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoasts();
    
    // Subscribe to new roasts
    const roastsChannel = supabase
      .channel(`roasts-channel-${battleId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'roasts', filter: `battle_id=eq.${battleId}` }, 
        (payload) => {
          setRoasts(prevRoasts => [...prevRoasts, payload.new as RoastData]);
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(roastsChannel);
    };
  }, [battleId]);

  return { roasts, isLoading, error };
}
