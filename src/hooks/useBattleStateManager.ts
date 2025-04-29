
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseBattleStateManagerProps {
  battleId: string;
  participants: any[];
  maxParticipants?: number;
  onBattleStateChange?: (state: 'waiting' | 'ready' | 'active' | 'completed') => void;
  onGetReadyModal?: () => void;
}

export function useBattleStateManager({
  battleId,
  participants,
  maxParticipants = 2,
  onBattleStateChange,
  onGetReadyModal
}: UseBattleStateManagerProps) {
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch battle state
  const fetchBattleState = useCallback(async () => {
    if (!battleId) return;
    
    try {
      setIsLoading(true);
      
      // Get battle status
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .select('status')
        .eq('id', battleId)
        .single();
        
      if (battleError) throw battleError;
      
      // Determine battle state
      const participantCount = participants.length;
      let newState: 'waiting' | 'ready' | 'active' | 'completed';
      
      if (battleData?.status === 'completed') {
        newState = 'completed';
      } else if (battleData?.status === 'active') {
        newState = 'active';
      } else if (participantCount < maxParticipants) {
        newState = 'waiting';
      } else {
        newState = 'ready';
        
        // If we've just reached the "ready" state, trigger the Get Ready modal
        if (battleState !== 'ready' && onGetReadyModal) {
          onGetReadyModal();
        }
        
        // If the state is ready but the battle status isn't active yet,
        // update the battle status to active
        if (battleData?.status !== 'active') {
          await supabase
            .from('battles')
            .update({ status: 'active' })
            .eq('id', battleId);
        }
      }
      
      if (newState !== battleState) {
        setBattleState(newState);
        
        if (onBattleStateChange) {
          onBattleStateChange(newState);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching battle state:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, [battleId, participants.length, maxParticipants, battleState, onBattleStateChange, onGetReadyModal]);

  // Set up subscription to battle changes
  useEffect(() => {
    if (!battleId) return;
    
    fetchBattleState();
    
    // Set up realtime subscription
    const battlesChannel = supabase
      .channel(`battles-${battleId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` }, 
        () => fetchBattleState()
      )
      .subscribe();
    
    // Use less frequent polling as a fallback
    const intervalId = setInterval(fetchBattleState, 30000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(battlesChannel);
    };
  }, [battleId, fetchBattleState]);

  return {
    battleState,
    isLoading,
    error,
    fetchBattleState
  };
}
