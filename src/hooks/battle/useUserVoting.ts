
import { useState, useEffect, useCallback } from 'react';
import { Vote } from '@/types/vote';
import { useVoteMutation } from './useBattleVotes';
import { toast } from '@/components/ui/sonner';

interface UseUserVotingProps {
  battleId: string | undefined;
  userId: string | undefined;
  votes: Vote[];
  isSpectator: boolean;
  battleState: 'waiting' | 'ready' | 'active' | 'completed';
  battleEnded: boolean;
}

/**
 * Hook to manage user voting
 */
export function useUserVoting({
  battleId,
  userId,
  votes,
  isSpectator,
  battleState,
  battleEnded
}: UseUserVotingProps) {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [canVote, setCanVote] = useState(false);
  const voteMutation = useVoteMutation();
  
  // Check if user has already voted
  useEffect(() => {
    if (!userId || !votes.length) {
      setUserVote(null);
      return;
    }
    
    const userVoteRecord = votes.find(vote => vote.voter_id === userId);
    if (userVoteRecord) {
      setUserVote(userVoteRecord.voted_for_user_id);
    }
  }, [votes, userId]);
  
  // Determine if user can vote
  useEffect(() => {
    if (!isSpectator || !userId) {
      setCanVote(false);
      return;
    }
    
    // Spectators can vote during active battles or right after they end
    setCanVote(battleState === 'active' || battleEnded);
  }, [isSpectator, userId, battleState, battleEnded]);
  
  // Handle voting
  const handleVote = useCallback(async (votedForId: string) => {
    if (!userId || !battleId) {
      toast.error("You need to be logged in to vote");
      return Promise.resolve();
    }
    
    if (!canVote) {
      toast.error("Voting is not available at this time");
      return Promise.resolve();
    }
    
    try {
      await voteMutation.mutateAsync({ 
        battleId, 
        voterId: userId, 
        votedForId, 
        score: 10 // Simple scoring system: 10 points per vote
      });
      
      toast.success("Vote submitted!");
      setUserVote(votedForId);
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error("Failed to submit vote");
      return Promise.reject(error);
    }
  }, [userId, battleId, canVote, voteMutation]);
  
  return {
    userVote,
    canVote,
    handleVote
  };
}
