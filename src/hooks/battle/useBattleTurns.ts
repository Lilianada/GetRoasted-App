
import { useState, useCallback } from 'react';
import { BattleParticipant } from '@/types/battle';

interface UseBattleTurnsProps {
  participants: BattleParticipant[];
  currentRound: number;
  onRoundComplete?: () => void;
}

/**
 * Hook to manage battle turns
 */
export function useBattleTurns({
  participants,
  currentRound,
  onRoundComplete
}: UseBattleTurnsProps) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
  // Get the current player's ID
  const currentTurnUserId = participants[currentTurnIndex]?.user_id;
  
  // Check if it's a specific player's turn
  const isPlayerTurn = useCallback((userId?: string) => {
    if (!userId) return false;
    return currentTurnUserId === userId;
  }, [currentTurnUserId]);
  
  // Move to the next player's turn
  const nextTurn = useCallback(() => {
    const nextPlayerIndex = (currentTurnIndex + 1) % participants.length;
    setCurrentTurnIndex(nextPlayerIndex);
    
    // If we've gone through all players, complete the round
    if (nextPlayerIndex === 0 && onRoundComplete) {
      onRoundComplete();
    }
  }, [currentTurnIndex, participants, onRoundComplete]);
  
  // Set a random player to start the turn
  const setRandomPlayerTurn = useCallback(() => {
    if (participants.length > 0) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentTurnIndex(randomIndex);
    }
  }, [participants]);
  
  // Reset to the first player
  const resetTurn = useCallback(() => {
    setCurrentTurnIndex(0);
  }, []);
  
  return {
    currentTurnUserId,
    currentTurnIndex,
    isPlayerTurn,
    nextTurn,
    setRandomPlayerTurn,
    resetTurn
  };
}
