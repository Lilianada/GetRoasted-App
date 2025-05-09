
import { BattleParticipant } from '@/types/battle';
import { useBattleInfo } from './useBattleInfo';
import { useBattleParticipants } from './useBattleParticipants';
import { useBattleVotes } from './useBattleVotes';

/**
 * Combined hook that provides all battle data
 */
export function useBattleData(battleId: string | undefined) {
  const { battle, isLoading: battleLoading, error: battleError } = useBattleInfo(battleId);
  const { participants, isLoading: participantsLoading, error: participantsError } = useBattleParticipants({battleId});
  const { votes, isLoading: votesLoading, error: votesError } = useBattleVotes(battleId);
  
  const isLoading = battleLoading || participantsLoading || votesLoading;
  const error = battleError || participantsError || votesError;
  
  return { 
    battle, 
    participants, 
    votes, 
    isLoading, 
    error 
  };
}

// Export these for backwards compatibility with any code that might be using them
export const useBattle = (battleId: string | undefined) => {
  const { battle, isLoading, error } = useBattleInfo(battleId);
  return { data: battle, isLoading, isError: !!error, error };
};

// Export adapter hooks for backward compatibility
export const useBattleParticipantsBase = (battleId: string | undefined) => {
  const { participants } = useBattleParticipants({battleId});
  return { data: participants };
};

export const useBattleVotesBase = (battleId: string | undefined) => {
  const { votes } = useBattleVotes(battleId);
  return { data: votes };
};

export { useVoteMutation } from './useBattleVotes';

// Re-export from the types
export type { BattleParticipant };
