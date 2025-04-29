
import { useState, useEffect, useMemo } from 'react';
import { Vote } from '@/types/vote';
import { BattleParticipant } from '@/types/battle';

interface UseBattleScoringProps {
  participants: BattleParticipant[];
  votes: Vote[];
}

/**
 * Hook to manage battle scoring
 */
export function useBattleScoring({
  participants,
  votes
}: UseBattleScoringProps) {
  const [participantScores, setParticipantScores] = useState<Record<string, number>>({});
  
  // Calculate scores when votes change
  useEffect(() => {
    if (!votes || votes.length === 0) return;
    
    // Group votes by voted_for_user_id
    const votesByParticipant: Record<string, number[]> = {};
    
    votes.forEach(vote => {
      if (!votesByParticipant[vote.voted_for_user_id]) {
        votesByParticipant[vote.voted_for_user_id] = [];
      }
      votesByParticipant[vote.voted_for_user_id].push(vote.score);
    });
    
    // Calculate total score for each participant
    const scores: Record<string, number> = {};
    
    Object.entries(votesByParticipant).forEach(([userId, userScores]) => {
      // Calculate the sum of all scores for this user
      scores[userId] = userScores.reduce((sum, score) => sum + score, 0);
    });
    
    setParticipantScores(scores);
  }, [votes]);
  
  // Find the winner based on scores
  const winner = useMemo(() => {
    if (participants.length === 0) return null;
    
    return [...participants]
      .map(p => ({
        ...p,
        score: participantScores[p.user_id || ''] || 0
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  }, [participants, participantScores]);
  
  // Add score to participant data
  const participantsWithScores = useMemo(() => {
    return participants.map(p => ({
      ...p,
      score: participantScores[p.user_id || ''] || 0
    }));
  }, [participants, participantScores]);
  
  return {
    participantScores,
    winner,
    participantsWithScores
  };
}
