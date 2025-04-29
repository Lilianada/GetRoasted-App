
import { useState, useCallback } from 'react';

interface UseBattleRoundsProps {
  totalRounds: number;
  onBattleComplete?: () => void;
}

/**
 * Hook to manage battle rounds
 */
export function useBattleRounds({
  totalRounds,
  onBattleComplete
}: UseBattleRoundsProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  
  // Move to the next round
  const nextRound = useCallback(() => {
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setShowRoundSummary(false);
    } else if (onBattleComplete) {
      onBattleComplete();
    }
  }, [currentRound, totalRounds, onBattleComplete]);
  
  // Show the round summary
  const showSummary = useCallback(() => {
    setShowRoundSummary(true);
  }, []);
  
  // Hide the round summary
  const hideSummary = useCallback(() => {
    setShowRoundSummary(false);
  }, []);
  
  // Reset to the first round
  const resetRounds = useCallback(() => {
    setCurrentRound(1);
    setShowRoundSummary(false);
  }, []);
  
  return {
    currentRound,
    totalRounds,
    showRoundSummary,
    nextRound,
    showSummary,
    hideSummary,
    resetRounds,
    setCurrentRound
  };
}
