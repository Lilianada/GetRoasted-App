
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to manage battle spectators
 */
export function useBattleSpectators(battleId: string | undefined) {
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch spectator count
  const fetchSpectatorCount = useCallback(async () => {
    if (!battleId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { count, error: countError } = await supabase
        .from('battle_spectators')
        .select('*', { count: 'exact', head: true })
        .eq('battle_id', battleId);
        
      if (countError) throw new Error(countError.message);
      
      setSpectatorCount(count || 0);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching spectator count:', err);
    } finally {
      setIsLoading(false);
    }
  }, [battleId]);

  // Join as spectator
  const joinAsSpectator = useCallback(async (userId: string) => {
    if (!battleId || !userId) return false;

    try {
      const { data: existingSpectator } = await supabase
        .from('battle_spectators')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', userId)
        .single();
        
      if (!existingSpectator) {
        const { error } = await supabase
          .from('battle_spectators')
          .insert({
            battle_id: battleId,
            user_id: userId
          });
          
        if (error) throw error;
      }
      
      await fetchSpectatorCount();
      return true;
    } catch (err) {
      console.error('Error joining as spectator:', err);
      return false;
    }
  }, [battleId, fetchSpectatorCount]);

  // Set up subscription to spectator changes
  useEffect(() => {
    if (!battleId) return;

    fetchSpectatorCount();
    
    // Subscribe to spectator changes
    const spectatorsChannel = supabase
      .channel(`spectators-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_spectators', filter: `battle_id=eq.${battleId}` }, 
        () => {
          fetchSpectatorCount();
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(spectatorsChannel);
    };
  }, [battleId, fetchSpectatorCount]);

  return { 
    spectatorCount, 
    isLoading, 
    error, 
    joinAsSpectator,
    fetchSpectatorCount
  };
}
