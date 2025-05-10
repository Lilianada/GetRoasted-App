
// Re-export the hooks from their new locations
import { useBattleJoin } from './battle/useBattleJoin';

interface UseBattleJoinProps {
  battleId: string;
  maxParticipants?: number;
  onParticipantCountChange?: (count: number) => void;
  onSpectatorCountChange?: (count: number) => void;
  currentUserId?: string;  // Updated prop name from userId to currentUserId
}

// Maintain the same interface for backward compatibility
export function useBattleParticipantsManager(props: UseBattleJoinProps) {
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
