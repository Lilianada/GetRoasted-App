
import { useState, useEffect, useCallback } from 'react';
import { useBattleParticipants } from './useBattleParticipants';
import { useBattleSpectators } from './useBattleSpectators';

interface UseBattleJoinProps {
  battleId: string;
  userId?: string;
  maxParticipants?: number;
  onParticipantCountChange?: (count: number) => void;
  onSpectatorCountChange?: (count: number) => void;
}

/**
 * Hook to manage joining battles as participant or spectator
 */
export function useBattleJoin({
  battleId,
  userId,
  maxParticipants = 2,
  onParticipantCountChange,
  onSpectatorCountChange
}: UseBattleJoinProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  
  // Use the participants and spectators hooks
  const {
    participants,
    joinAsBattleParticipant,
    fetchParticipants
  } = useBattleParticipants({
    battleId,
    userId,
    maxParticipants,
    onParticipantCountChange
  });
  
  const {
    spectators,
    joinAsSpectator,
    fetchSpectators
  } = useBattleSpectators({
    battleId,
    userId,
    onSpectatorCountChange
  });
  
  // Combined join battle logic
  const joinBattle = useCallback(async () => {
    if (!battleId || !userId || hasJoined) return;
    
    try {
      // First try to join as a participant
      const joinedAsParticipant = await joinAsBattleParticipant();
      
      // If couldn't join as participant, join as spectator
      if (!joinedAsParticipant) {
        await joinAsSpectator();
      }
      
      // Refresh data
      await Promise.all([fetchParticipants(), fetchSpectators()]);
      
      setHasJoined(true);
    } catch (err) {
      console.error('Error joining battle:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [battleId, userId, hasJoined, joinAsBattleParticipant, joinAsSpectator, fetchParticipants, fetchSpectators]);

  // Only attempt to join once on initial render or when dependencies change
  useEffect(() => {
    if (battleId && userId && !hasJoined && !isLoading) {
      joinBattle();
    }
  }, [battleId, userId, joinBattle, hasJoined, isLoading]);

  // Return combined data and functionality
  return {
    participants,
    spectators,
    isLoading,
    error,
    joinBattle,
    fetchParticipants,
    fetchSpectators,
    hasJoined
  };
}
