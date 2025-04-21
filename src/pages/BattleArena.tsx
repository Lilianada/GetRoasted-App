import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Mic, MicOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React from "react";

interface Participant {
  id: string;
  username: string;
  // Add avatar_url if available
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
}) => {
  return (
    <Card className="p-4 bg-yellow border-2 border-black border-night-700">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-flame-600/20 text-flame-500">
              {/* TODO: Add round info when available */}
              Battle
            </Badge>
            <Badge variant="outline" className="bg-night-700">
              <Users className="h-3 w-3 mr-1" />
              {spectatorCount} Spectators
            </Badge>
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
      <div className="flex justify-between items-center mb-4">
        {participants.map((player, index) => (
          <div key={player.id} className={`flex ${index === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-3`}>
            <Avatar className="h-12 w-12 border-2 border-night-700">
              {/* If you have avatar_url, use it here */}
              <AvatarFallback className="bg-night-700 text-yellow-500">
                {player.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`text-${index === 0 ? "left" : "right"}`}>
              <div className="font-medium">{player.username}</div>
            </div>
          </div>
        ))}
      </div>
      {/* TODO: Render real roasts here when implemented */}
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
    </Card>
  );
};

export default BattleArena;
