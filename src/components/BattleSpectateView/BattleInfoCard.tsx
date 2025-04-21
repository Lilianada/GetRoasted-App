import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface BattleInfoCardProps {
  battle: any;
  currentRound: number;
}

const BattleInfoCard: React.FC<BattleInfoCardProps> = ({ battle, currentRound }) => {
  if (!battle) return null;

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={battle.profiles?.avatar_url} />
            <AvatarFallback>{battle.profiles?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{battle.profiles?.username}</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant={battle.status === 'active' ? "default" : "outline"}>
            {battle.status === 'waiting' ? 'Waiting' : 
             battle.status === 'active' ? 'Live' : 'Completed'}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Rounds</p>
          <div className="flex gap-2">
            {Array.from({ length: battle.round_count }).map((_, i) => (
              <Badge 
                key={i} 
                variant={i + 1 === currentRound ? "default" : "outline"}
              >
                {i + 1}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BattleInfoCard;
