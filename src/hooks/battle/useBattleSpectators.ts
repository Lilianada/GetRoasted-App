
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BattleSpectator } from '@/types/battle';
import { toast } from '@/components/ui/sonner';

interface UseBattleSpectatorsProps {
  battleId: string;
  userId?: string;
  onSpectatorCountChange?: (count: number) => void;
}

/**
 * Hook to manage battle spectators
 */
export function useBattleSpectators({
  battleId,
  userId,
  onSpectatorCountChange
}: UseBattleSpectatorsProps) {
  const [spectators, setSpectators] = useState<BattleSpectator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch battle spectators
  const fetchSpectators = useCallback(async () => {
    if (!battleId) return;
    
    try {
      setIsLoading(true);
      
      // Get spectators
      const { data: spectatorsData, error: spectatorsError } = await supabase
        .from('battle_spectators')
        .select('*')
        .eq('battle_id', battleId);
        
      if (spectatorsError) throw spectatorsError;
      
      // Update state with fetched data
      const typedSpectators = spectatorsData as BattleSpectator[] || [];
      setSpectators(typedSpectators);
      
      if (onSpectatorCountChange) {
        onSpectatorCountChange(typedSpectators.length);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching battle spectators data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, [battleId, onSpectatorCountChange]);

  // Join battle as spectator
  const joinAsSpectator = useCallback(async () => {
    if (!battleId || !userId) return false;
    
    try {
      // Check if already a spectator
      const { data: existingSpectator } = await supabase
        .from('battle_spectators')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', userId)
        .single();
        
      if (existingSpectator) {
        return true; // Already a spectator
      }
      
      const { error: spectatorError } = await supabase
        .from('battle_spectators')
        .insert({
          battle_id: battleId,
          user_id: userId
        });
        
      if (spectatorError) throw spectatorError;
      
      toast.info("You've joined as a spectator");
      return true;
    } catch (err) {
      console.error('Error joining as spectator:', err);
      return false;
    }
  }, [battleId, userId]);

  // Set up subscription to spectator changes
  useEffect(() => {
    if (!battleId) return;
    
    fetchSpectators();
    
    // Set up realtime subscriptions
    const spectatorsChannel = supabase
      .channel(`battle-spectators-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_spectators', filter: `battle_id=eq.${battleId}` }, 
        () => fetchSpectators()
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(spectatorsChannel);
    };
  }, [battleId, fetchSpectators]);

  return {
    spectators,
    isLoading,
    error,
    fetchSpectators,
    joinAsSpectator
  };
}
