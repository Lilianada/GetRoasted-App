
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useBattleContext } from '@/context/BattleContext';
import BattleTimerDisplay from './BattleTimerDisplay';
import BattleTurnIndicator from './BattleTurnIndicator';
import RoastInput from './RoastInput';
import RoundSummary from './RoundSummary';
import BattleResults from './BattleResults';
import BattleVotingPanel from './BattleVotingPanel';
import BattleControls from './BattleControls';
import BattleArenaHeader from './BattleArenaHeader';

interface BattleArenaContainerProps {
  setShowChat: (value: boolean) => void;
  showChat: boolean;
}

const BattleArenaContainer: React.FC<BattleArenaContainerProps> = ({ 
  setShowChat, 
  showChat 
}) => {
  const {
    participants,
    spectatorCount,
    isSpectator,
    currentRound,
    totalRounds,
    showRoundSummary,
    battleEnded,
    winner,
    canVote,
    userVote,
    handleNextRound,
    handleRematch,
    handleVote,
    handleSendRoast,
    isPlayerTurn
  } = useBattleContext();

  if (battleEnded && winner) {
    return (
      <div className="space-y-6">
        <BattleResults 
          winner={winner}
          participants={participants}
          onRematch={handleRematch}
        />
        
        <BattleVotingPanel
          isSpectator={isSpectator}
          canVote={canVote}
          participants={participants}
          onVote={handleVote}
          userVote={userVote}
        />
      </div>
    );
  }

  if (showRoundSummary) {
    return (
      <RoundSummary
        roundNumber={currentRound}
        totalRounds={totalRounds}
        participants={participants}
        onNextRound={handleNextRound}
      />
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="border-b-2 border-black pb-3">
        <BattleArenaHeader 
          currentRound={currentRound}
          totalRounds={totalRounds}
          spectatorCount={spectatorCount}
        />
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <BattleTimerDisplay className="mb-4" />
        <BattleTurnIndicator />
        <RoastInput 
          onSendRoast={handleSendRoast}
          isPlayerTurn={isPlayerTurn()}
          disabled={false}
        />

        <BattleControls 
          isSpectator={isSpectator}
          showChat={showChat}
          setShowChat={setShowChat}
        />

        <BattleVotingPanel
          isSpectator={isSpectator}
          canVote={canVote}
          participants={participants}
          onVote={handleVote}
          userVote={userVote}
        />
      </CardContent>
    </Card>
  );
};

export default BattleArenaContainer;
