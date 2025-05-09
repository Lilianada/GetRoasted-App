
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { useBattle, useBattleParticipantsBase, useBattleVotesBase } from "@/hooks/battle/useBattleData";
import { useBattleStateContext } from './BattleStateContext';
import { useBattleParticipationContext } from './BattleParticipationContext';
import { useBattleTimerContext } from './BattleTimerContext';
import { useBattleRoundContext } from './BattleRoundContext';
import { useBattleVotingContext } from './BattleVotingContext';
import { useBattleActionsContext } from './BattleActionsContext';
import { BattleContext } from './BattleContext';
import { Participant } from "@/types/battle";

interface BattleContextConsumerProps {
  children: ReactNode;
  battleId: string | undefined;
  isLoading: boolean;
  error: any;
}

export const BattleContextConsumer = ({ 
  children,
  battleId,
  isLoading,
  error
}: BattleContextConsumerProps) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Fetch data using hooks
  const { data: battle } = useBattle(battleId);
  const { data: participantsData = [] } = useBattleParticipantsBase(battleId);
  const { data: votes = [] } = useBattleVotesBase(battleId);
  
  // Consume all context providers
  const stateContext = useBattleStateContext();
  const participationContext = useBattleParticipationContext();
  const timerContext = useBattleTimerContext();
  const roundContext = useBattleRoundContext();
  const votingContext = useBattleVotingContext();
  const actionsContext = useBattleActionsContext();
  
  // Transform participants data with scores
  const participants: Participant[] = participantsData.map(p => ({
    id: p.id,
    username: p.username || 'Unknown',
    avatar_url: p.avatar_url,
    score: votingContext.participantScores[p.id] || 0
  }));
  
  // Check user role (participant or spectator)
  useEffect(() => {
    if (!battleId || !user) return;
    
    const checkUserRole = async () => {
      try {
        const { data: isParticipant } = await supabase
          .from('battle_participants')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (isParticipant) {
          participationContext.setIsSpectator(false);
          return;
        }
        
        const { data: isSpectator } = await supabase
          .from('battle_spectators')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (isSpectator) {
          participationContext.setIsSpectator(true);
        } else {
          const { error } = await supabase
            .from('battle_spectators')
            .insert({
              battle_id: battleId,
              user_id: user.id
            });
            
          if (error) throw error;
          participationContext.setIsSpectator(true);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    
    checkUserRole();
  }, [battleId, user, participationContext]);
  
  // Calculate participant scores whenever votes change
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
    
    votingContext.setParticipantScores(scores);
    
    // Check if current user has already voted
    if (user) {
      const userVoteRecord = votes.find(vote => vote.voter_id === user.id);
      if (userVoteRecord) {
        votingContext.setUserVote(userVoteRecord.voted_for_user_id);
      }
    }
  }, [votes, user, votingContext]);
  
  // Handle voting permission
  useEffect(() => {
    if (!participationContext.isSpectator || !user) {
      votingContext.setCanVote(false);
      return;
    }
    
    // Spectators can vote during active battles or right after they end
    votingContext.setCanVote(stateContext.battleState === 'active' || stateContext.battleEnded);
  }, [participationContext.isSpectator, user, stateContext.battleState, stateContext.battleEnded, votingContext]);
  
  // Convert BattleData to Battle type for the context
  const convertedBattle = battle ? {
    id: battle.id,
    title: battle.title,
    status: battle.status as 'waiting' | 'ready' | 'active' | 'completed',
    roundCount: battle.round_count || 3,
    type: battle.type as 'public' | 'private',
    participants: participants,
    spectatorCount: participationContext.spectatorCount,
    timeRemaining: timerContext.timeRemaining,
    round_count: battle.round_count,
    time_per_turn: battle.time_per_turn
  } : null;

  // Create the combined context value
  const contextValue = {
    battleId,
    battle: convertedBattle,
    participants,
    isSpectator: participationContext.isSpectator,
    currentRound: roundContext.currentRound,
    totalRounds: roundContext.totalRounds,
    currentTurnUserId: participationContext.currentTurnUserId,
    timeRemaining: timerContext.timeRemaining,
    timePerTurn: timerContext.timePerTurn,
    timePercentage: timerContext.timePercentage,
    battleState: stateContext.battleState,
    showRoundSummary: stateContext.showRoundSummary,
    battleEnded: stateContext.battleEnded,
    winner: stateContext.winner,
    spectatorCount: participationContext.spectatorCount,
    participantScores: votingContext.participantScores,
    userVote: votingContext.userVote,
    canVote: votingContext.canVote,
    isPlayerTurn: participationContext.isPlayerTurn,
    formatTime: timerContext.formatTime,
    handleSendRoast: actionsContext.handleSendRoast,
    handleNextRound: roundContext.handleNextRound,
    handleRematch: actionsContext.handleRematch,
    handleVote: votingContext.handleVote,
    handleTimerUpdate: timerContext.handleTimerUpdate,
    setShowRoundSummary: stateContext.setShowRoundSummary,
    setBattleState: stateContext.setBattleState,
    setSpectatorCount: participationContext.setSpectatorCount,
    setCurrentRound: roundContext.setCurrentRound,
    isLoading,
    error
  };

  return (
    <BattleContext.Provider value={contextValue}>
      {children}
    </BattleContext.Provider>
  );
};
