
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, Send, Award, Trophy, ChartBar, Play,
  Users
} from "lucide-react";
import BattleTimer from "./BattleTimer";
import RoundSummary from "./battle/RoundSummary";
import BattleResults from "./battle/BattleResults";
import { VotingSystem } from "./battle/VotingSystem";
import SpectatorReactions from './battle/SpectatorReactions';
import SpectatorChat from './battle/SpectatorChat';
import BattleStatistics from './battle/BattleStatistics';
import BattleReplay from './battle/BattleReplay';
import AchievementPopup from './achievements/AchievementPopup';
import { useAchievements, ACHIEVEMENTS } from '@/hooks/useAchievements';

interface BattleArenaProps {
  participants: any[];
  spectatorCount: number;
  roastInput: string;
  setRoastInput: (value: string) => void;
  isSpectator: boolean;
  showChat: boolean;
  setShowChat: (value: boolean) => void;
  timeRemaining: number;
  timePercentage: number;
  formatTime: (seconds: number) => string;
  isPlayerTurn: () => boolean;
  handleSendRoast: () => void;
  currentRound: number;
  totalRounds: number;
  currentTurnUserId?: string;
  showRoundSummary?: boolean;
  onNextRound?: () => void;
  battleEnded?: boolean;
  winner?: any;
  onRematch?: () => void;
  canVote: boolean;
  onVote: (optionId: string) => void;
  userVote?: string;
}

const BattleArena = ({
  participants,
  spectatorCount,
  roastInput,
  setRoastInput,
  isSpectator,
  showChat,
  setShowChat,
  timeRemaining,
  timePercentage,
  formatTime,
  isPlayerTurn,
  handleSendRoast,
  currentRound,
  totalRounds,
  currentTurnUserId,
  showRoundSummary,
  onNextRound,
  battleEnded,
  winner,
  onRematch,
  canVote,
  onVote,
  userVote
}: BattleArenaProps) => {
  const [showStats, setShowStats] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const { newAchievement, clearNewAchievement } = useAchievements();

  if (battleEnded && winner) {
    return (
      <div className="space-y-6">
        <BattleResults 
          winner={winner}
          participants={participants}
          onRematch={onRematch}
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
            <ChartBar className="h-4 w-4" />
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
            <Play className="h-4 w-4" />
            Battle Replay
          </Button>
        </div>
        
        {/* Conditionally show battle statistics */}
        {showStats && (
          <BattleStatistics 
            battleId="123" // Replace with actual battleId prop
            participants={participants}
          />
        )}
        
        {/* Conditionally show battle replay */}
        {showReplay && (
          <BattleReplay 
            battleId="123" // Replace with actual battleId prop
            participants={participants}
          />
        )}
        
        {/* Voting section for spectators */}
        {isSpectator && canVote && (
          <div className="mt-6">
            <VotingSystem
              options={participants.map(p => ({
                id: p.id,
                name: p.username || 'Unknown Player',
                avatar: p.avatar_url
              }))}
              onVote={onVote}
              disabled={!canVote}
              votedFor={userVote}
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
        onNextRound={onNextRound}
      />
    );
  }

  const currentTurnPlayer = participants.find(p => p.id === currentTurnUserId);

  return (
    <div className="space-y-4">
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
          <div className="mb-4">
            <BattleTimer
              initialSeconds={timeRemaining}
              isActive={isPlayerTurn()}
              showWarningAt={30}
            />
          </div>

          {currentTurnPlayer && (
            <div className="bg-secondary/20 p-2 rounded text-center">
              <span className="text-sm">
                Current Turn: <span className="font-semibold">{currentTurnPlayer.username}</span>
              </span>
            </div>
          )}

          <Textarea
            value={roastInput}
            onChange={(e) => setRoastInput(e.target.value)}
            placeholder={
              isSpectator
                ? "You are in spectator mode"
                : isPlayerTurn()
                ? "Type your roast..."
                : "Waiting for your turn..."
            }
            className="min-h-[100px] bg-white text-black"
            disabled={isSpectator || !isPlayerTurn()}
          />

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
            
            <Button
              onClick={handleSendRoast}
              disabled={!roastInput.trim() || isSpectator || !isPlayerTurn()}
              className="gap-2 ml-auto"
            >
              <Send className="h-4 w-4" />
              Send Roast
            </Button>
          </div>

          {/* Spectator reactions component */}
          {isSpectator && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">React to the battle:</p>
              <SpectatorReactions battleId="123" /> {/* Replace with actual battleId prop */}
            </div>
          )}

          {/* Spectator voting */}
          {isSpectator && canVote && (
            <div className="mt-6">
              <VotingSystem
                options={participants.map(p => ({
                  id: p.id,
                  name: p.username || 'Unknown Player',
                  avatar: p.avatar_url
                }))}
                onVote={onVote}
                disabled={!canVote}
                votedFor={userVote}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spectator chat component */}
      {isSpectator && showChat && (
        <div className="mt-4">
          <SpectatorChat 
            battleId="123" // Replace with actual battleId prop
            onToggleChat={() => setShowChat(!showChat)}
          />
        </div>
      )}
      
      {/* Achievement popup */}
      {newAchievement && (
        <AchievementPopup 
          achievement={newAchievement} 
          onClose={clearNewAchievement}
        />
      )}
    </div>
  );
};

export default BattleArena;
