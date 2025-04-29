import { BattleData, BattleParticipant } from '@/types/battle';
import { Vote } from '@/types/vote';
import { useBattleInfo } from './useBattleInfo';
import { useBattleParticipants } from './useBattleParticipants';
import { useBattleVotes, useVoteMutation } from './useBattleVotes';

/**
 * Combined hook that provides all battle data
 */
export function useBattleData(battleId: string | undefined) {
  const { battle, isLoading: battleLoading, error: battleError } = useBattleInfo(battleId);
  const { participants, isLoading: participantsLoading, error: participantsError } = useBattleParticipants(battleId);
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

export const useBattleParticipants = (battleId: string | undefined) => {
  const { participants, isLoading, error } = useBattleParticipants(battleId);
  return { data: participants, isLoading, isError: !!error, error };
};

export const useSpectatorCount = (battleId: string | undefined) => {
  const { participants, isLoading, error } = useBattleParticipants(battleId);
  // This is a placeholder - you might want to implement actual spectator count logic
  const spectatorCount = participants?.length || 0;
  return { data: spectatorCount, isLoading, isError: !!error, error };
};

export const useBattleVotes = (battleId: string | undefined) => {
  const { votes, isLoading, error } = useBattleVotes(battleId);
  return { data: votes, isLoading, isError: !!error, error };
};

export { useVoteMutation } from './useBattleVotes';
export type { BattleData, BattleParticipant };
