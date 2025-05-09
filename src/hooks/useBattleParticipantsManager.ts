
// Re-export the hooks from their new locations
import { useBattleJoin } from './battle/useBattleJoin';

// Maintain the same interface for backward compatibility
export function useBattleParticipantsManager(props: Parameters<typeof useBattleJoin>[0]) {
  const {
    participants,
    spectators,
    isLoading,
    error,
    joinBattle,
    fetchParticipants: fetchParticipantsData
  } = useBattleJoin(props);

  // Return the same interface as the original hook
  return {
    participants,
    spectators,
    isLoading,
    error,
    joinBattle,
    fetchParticipantsData
  };
}
