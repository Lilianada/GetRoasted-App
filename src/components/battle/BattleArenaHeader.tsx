
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users } from "lucide-react";

interface BattleArenaHeaderProps {
  currentRound: number;
  totalRounds: number;
  spectatorCount: number;
}

const BattleArenaHeader: React.FC<BattleArenaHeaderProps> = ({ 
  currentRound, 
  totalRounds, 
  spectatorCount 
}) => {
  return (
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
  );
};

export default BattleArenaHeader;
