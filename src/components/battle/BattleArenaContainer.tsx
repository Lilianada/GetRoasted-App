
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users } from "lucide-react";
import { useBattleContext } from '@/context/BattleContext';
import BattleTimerDisplay from './BattleTimerDisplay';
import BattleTurnIndicator from './BattleTurnIndicator';
import RoastInput from './RoastInput';
import RoundSummary from './RoundSummary';
import BattleResults from './BattleResults';
import { VotingSystem } from './VotingSystem';

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
        
        {/* Voting section for spectators */}
        {isSpectator && canVote && (
          <div className="mt-6">
            <VotingSystem
              options={participants.map(p => ({
                id: p.id,
                name: p.username || 'Unknown Player',
                avatar: p.avatar_url
              }))}
              onVote={handleVote}
              disabled={!canVote}
              votedFor={userVote || undefined}
            />
          </div>
        )}
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-black flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-flame-500" />
            Roast Battle
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-black">
              Round {currentRound}/{totalRounds}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-black">
              <Users className="h-3 w-3" />
              <span>{spectatorCount}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <BattleTimerDisplay className="mb-4" />
        <BattleTurnIndicator />
        <RoastInput />

        <div className="flex justify-between">
          {isSpectator && (
            <Button
              variant="outline"
              onClick={() => setShowChat(!showChat)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {showChat ? 'Hide Chat' : 'Show Chat'}
            </Button>
          )}
        </div>

        {/* Spectator voting */}
        {isSpectator && canVote && (
          <div className="mt-6">
            <VotingSystem
              options={participants.map(p => ({
                id: p.id,
                name: p.username || 'Unknown Player',
                avatar: p.avatar_url
              }))}
              onVote={handleVote}
              disabled={!canVote}
              votedFor={userVote || undefined}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BattleArenaContainer;
