
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface BattleInfo {
  id: string;
  title: string;
  status: 'waiting' | 'ready' | 'active' | 'completed';
  type: 'public' | 'private';
  round_count: number;
  time_per_turn: number;
  allow_spectators: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch and subscribe to battle information
 */
export function useBattleInfo(battleId: string | undefined) {
  const [battle, setBattle] = useState<BattleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!battleId) {
      setIsLoading(false);
      return;
    }

    const fetchBattle = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch battle details
        const { data: battleData, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();
          
        if (battleError) throw new Error(battleError.message);
        
        setBattle(battleData as BattleInfo);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching battle data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBattle();
    
    // Subscribe to battle changes
    const battleChannel = supabase
      .channel(`battle-changes-${battleId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` }, 
        (payload) => {
          setBattle(payload.new as BattleInfo);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(battleChannel);
    };
  }, [battleId]);
  
  return { battle, isLoading, error };
}
