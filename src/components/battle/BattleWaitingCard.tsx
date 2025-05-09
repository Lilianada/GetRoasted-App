
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Flame } from "lucide-react";
import BattleCodeDisplay from './BattleCodeDisplay';
import BattleParticipantsDisplay from './BattleParticipantsDisplay';
import BattleReadyConfirmation from './BattleReadyConfirmation';

interface BattleWaitingCardProps {
  battleData: any;
  participants: any[];
  onInviteContacts?: () => void;
  onEnterBattleRoom?: () => void;
  onBothPlayersReady?: () => void;
}

const BattleWaitingCard = ({
  battleData,
  participants,
  onInviteContacts,
  onEnterBattleRoom,
  onBothPlayersReady
}: BattleWaitingCardProps) => {
  const canEnterBattle = battleData?.status === 'active' || participants.length >= 2;
  
  return (
    <Card className="border-2 border-black shadow-neo bg-purple/10">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Waiting Room</span>
          <span className="text-sm font-normal bg-secondary/50 px-2 py-1 rounded">
            {battleData?.status === 'active' ? 'Battle Active' : 'Waiting for Players'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Battle Info */}
        <div>
          <h3 className="text-lg font-semibold mb-1">{battleData?.title}</h3>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{battleData?.round_count} rounds</span>
            <span>•</span>
            <span>{Math.floor(battleData?.time_per_turn / 60)}m {battleData?.time_per_turn % 60}s per turn</span>
          </div>
        </div>
        
        {/* Battle Code */}
        <BattleCodeDisplay 
          inviteCode={battleData?.invite_code || ''} 
          onInviteContacts={onInviteContacts || (() => {})}
        />
        
        {/* Participants */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Participants</h3>
          <BattleParticipantsDisplay participants={participants} />
        </div>
        
        {/* Ready Confirmation */}
        <BattleReadyConfirmation 
          battleId={battleData?.id} 
          participantCount={participants.length}
          onBothPlayersReady={onBothPlayersReady}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onEnterBattleRoom} 
          className="w-full bg-flame-500 hover:bg-flame-600 text-white gap-2"
          disabled={!canEnterBattle}
        >
          <Flame className="h-4 w-4" />
          {battleData?.status === 'active' ? 'Enter Battle Room' : 'Waiting for Opponent'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BattleWaitingCard;
