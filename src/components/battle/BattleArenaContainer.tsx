
import React, { useState } from 'react';
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
  const [showStats, setShowStats] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  
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
    handleVote
  } = useBattleContext();

  if (battleEnded && winner) {
    return (
      <div className="space-y-6">
        <BattleResults 
          winner={winner}
          participants={participants}
          onRematch={handleRematch}
        />
        
        {/* Feature tabs for statistics and replay */}
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <Button 
            variant={showStats ? "default" : "outline"}
            className="gap-2"
            onClick={() => {
              setShowStats(true);
              setShowReplay(false);
            }}
          >
            <span className="h-4 w-4" />
            Battle Statistics
          </Button>
          
          <Button 
            variant={showReplay ? "default" : "outline"}
            className="gap-2"
            onClick={() => {
              setShowReplay(true);
              setShowStats(false);
            }}
          >
            <span className="h-4 w-4" />
            Battle Replay
          </Button>
        </div>
        
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
        <RoastInput />

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

// Import Button component for TypeScript support
import { Button } from "@/components/ui/button";
