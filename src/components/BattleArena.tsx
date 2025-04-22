
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send } from "lucide-react";
import BattleTimer from "./BattleTimer";
import RoundSummary from "./battle/RoundSummary";
import BattleResults from "./battle/BattleResults";

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
  onRematch
}: BattleArenaProps) => {
  if (battleEnded && winner) {
    return (
      <BattleResults 
        winner={winner}
        participants={participants}
        onRematch={onRematch}
      />
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

        <div className="flex justify-end">
          <Button
            onClick={handleSendRoast}
            disabled={!roastInput.trim() || isSpectator || !isPlayerTurn()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send Roast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BattleArena;
