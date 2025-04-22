
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Mic, MicOff, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React from "react";
import { VotingSystem } from "@/components/battle/VotingSystem";

interface Participant {
  id: string;
  username: string;
  avatar_url?: string;
  score?: number;
}

interface BattleArenaProps {
  participants: Participant[];
  spectatorCount: number;
  roastInput: string;
  setRoastInput: (v: string) => void;
  isSpectator: boolean;
  showChat: boolean;
  setShowChat: (v: boolean) => void;
  timeRemaining: number;
  timePercentage: number;
  formatTime: (s: number) => string;
  isPlayerTurn: () => boolean;
  handleSendRoast: () => void;
  currentRound?: number;
  totalRounds?: number;
  currentTurnUserId?: string;
  showRoundSummary?: boolean;
  onNextRound?: () => void;
  battleEnded?: boolean;
  winner?: any;
  onRematch?: () => void;
  canVote?: boolean;
  onVote?: (userId: string) => void;
  userVote?: string | null;
}

const BattleArena: React.FC<BattleArenaProps> = ({
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
  canVote = false,
  onVote,
  userVote
}) => {
  // Display the round completion or battle end screen when appropriate
  if (battleEnded && winner) {
    return (
      <div className="space-y-6">
        {/* Display the battle results */}
        <Card className="p-6 bg-yellow border-2 border-black border-night-700">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Award className="h-8 w-8 text-flame-500" />
            Battle Completed!
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {participants.map((player) => (
              <div 
                key={player.id} 
                className={`p-4 rounded-lg border-2 ${
                  player.id === winner.id 
                    ? "border-flame-500 bg-flame-500/10" 
                    : "border-night-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-night-700">
                    {player.avatar_url && (
                      <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
                    )}
                    <AvatarFallback className="bg-night-700 text-yellow-500">
                      {player.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{player.username}</div>
                    <div className="text-sm">
                      {player.id === winner.id ? (
                        <span className="text-flame-500 font-bold">Winner!</span>
                      ) : (
                        <span className="text-night-500">Runner-up</span>
                      )}
                    </div>
                    <div className="text-sm mt-1">Score: {player.score || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-3">
            <Button onClick={onRematch} variant="default" className="bg-flame-500 hover:bg-flame-600">
              Rematch
            </Button>
          </div>
        </Card>
        
        {/* Add voting section for spectators if the battle just ended */}
        {isSpectator && canVote && (
          <Card className="p-6 bg-night-800 border-2 border-night-700">
            <h3 className="text-xl font-bold mb-4">Cast Your Vote</h3>
            <VotingSystem 
              options={participants.map(p => ({ 
                id: p.id, 
                name: p.username, 
                avatar: p.avatar_url 
              }))}
              onVote={onVote!}
              disabled={!canVote}
              votedFor={userVote}
            />
          </Card>
        )}
      </div>
    );
  }

  if (showRoundSummary) {
    return (
      <Card className="p-6 bg-yellow border-2 border-black border-night-700">
        <h2 className="text-xl font-bold text-center mb-4">Round {currentRound} Complete</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {participants.map((player) => (
            <div key={player.id} className="p-4 border border-night-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-night-700">
                  {player.avatar_url && (
                    <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
                  )}
                  <AvatarFallback className="bg-night-700 text-yellow-500">
                    {player.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.username}</div>
                  <div className="text-sm mt-1">Score: {player.score || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-night-400 mb-4">Next round starting soon...</p>
          <Button onClick={onNextRound} variant="default" className="bg-flame-500 hover:bg-flame-600">
            Continue to Round {(currentRound || 0) + 1}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-yellow border-2 border-black border-night-700">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-flame-600/20 text-flame-500">
              {currentRound && totalRounds ? `Round ${currentRound}/${totalRounds}` : "Battle"}
            </Badge>
            <Badge variant="outline" className="bg-night-700">
              <Users className="h-3 w-3 mr-1" />
              {spectatorCount} Spectators
            </Badge>
            {isSpectator && (
              <Badge variant="outline" className="bg-flame-600/20 text-flame-500">
                <Award className="h-3 w-3 mr-1" />
                Spectator Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={timeRemaining < 30 ? "destructive" : "outline"} className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeRemaining)}
            </Badge>
            {isSpectator ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-night-700 border-night-600"
                onClick={() => setShowChat(!showChat)}
              >
                <Mic className="h-4 w-4 mr-1" />
                Chat
              </Button>
            ) : (
              <Button 
                variant={isPlayerTurn() ? "default" : "outline"}
                size="sm" 
                disabled={!isPlayerTurn()}
              >
                {isPlayerTurn() ? (
                  <>
                    <Mic className="h-4 w-4 mr-1" />
                    Your Turn
                  </>
                ) : (
                  <>
                    <MicOff className="h-4 w-4 mr-1" />
                    Waiting
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        <Progress value={timePercentage} className="h-2" />
      </div>

      {/* Score display */}
      <div className="mb-4 p-3 bg-night-800 rounded-lg">
        <h3 className="text-sm font-medium text-center mb-2">Current Scores</h3>
        <div className="flex justify-between">
          {participants.map((player) => (
            <div key={player.id} className="text-center">
              <div className="font-medium">{player.username}</div>
              <div className="text-xl font-bold">{player.score || 0}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        {participants.map((player, index) => (
          <div key={player.id} className={`flex ${index === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-3`}>
            <Avatar className="h-12 w-12 border-2 border-night-700">
              {player.avatar_url && (
                <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
              )}
              <AvatarFallback className="bg-night-700 text-yellow-500">
                {player.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`text-${index === 0 ? "left" : "right"}`}>
              <div className="font-medium">{player.username}</div>
              {currentTurnUserId === player.id && (
                <div className="text-xs text-flame-500">Current Turn</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Roast message display area would go here */}
      {!isSpectator && (
        <div className="relative">
          <Textarea 
            placeholder={isPlayerTurn() ? "Type your roast here..." : "Waiting for your turn..."}
            className="min-h-[100px] border-night-700 focus-visible:ring-flame-500 pr-12"
            value={roastInput}
            onChange={(e) => setRoastInput(e.target.value)}
            disabled={!isPlayerTurn()}
          />
          <Button 
            size="icon" 
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-flame-500 hover:bg-flame-600"
            onClick={handleSendRoast}
            disabled={!isPlayerTurn() || roastInput.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Show voting section for spectators during active rounds */}
      {isSpectator && currentRound && !showRoundSummary && !battleEnded && canVote && (
        <div className="mt-4 p-3 bg-night-800 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Vote for this round</h3>
          <div className="flex justify-center gap-4">
            {participants.map((player) => (
              <Button
                key={player.id}
                variant={userVote === player.id ? "default" : "outline"}
                className={userVote === player.id ? "bg-flame-500" : ""}
                onClick={() => onVote && onVote(player.id)}
                disabled={!canVote || !!userVote}
              >
                {player.username}
              </Button>
            ))}
          </div>
          {userVote && (
            <p className="text-xs text-center mt-2 text-flame-500">Your vote has been recorded!</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default BattleArena;
