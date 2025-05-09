
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BattleCodeDisplay from "@/components/battle/BattleCodeDisplay";
import BattleParticipantsDisplay from "@/components/battle/BattleParticipantsDisplay";
import BattleReadyConfirmation from "@/components/battle/BattleReadyConfirmation";

interface BattleWaitingCardProps {
  battleData: any;
  participants: any[];
  onInviteContacts: () => void;
  onEnterBattleRoom: () => void;
  onBothPlayersReady: () => void;
}

const BattleWaitingCard = ({
  battleData,
  participants,
  onInviteContacts,
  onEnterBattleRoom,
  onBothPlayersReady
}: BattleWaitingCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{battleData.title}</CardTitle>
        <CardDescription>
          {participants.length < 2 ? "Waiting for opponent to join..." : "Both players must type 'Start' to begin"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Battle code display component */}
        <BattleCodeDisplay 
          inviteCode={battleData.invite_code || '------'} 
          onInviteContacts={onInviteContacts} 
        />
      
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Battle Timer Info */}
          <div className="w-full flex justify-center items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-lg">
            <div className="w-5 h-5 text-flame-500">⏱️</div>
            <span>Time per turn: {battleData.time_per_turn / 60} minutes</span>
          </div>
          
          {/* Battle participants display */}
          <BattleParticipantsDisplay 
            participants={participants}
            maxParticipants={2}
          />
          
          {/* Ready confirmation for starting the battle */}
          {participants.length > 0 && (
            <BattleReadyConfirmation 
              battleId={battleData.id || ''}
              onBothPlayersReady={onBothPlayersReady}
              participantCount={participants.length}
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-night-800 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/battles')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </Button>
        
        {participants.length >= 1 && (
          <Button
            className="bg-flame-500 hover:bg-flame-600 text-white gap-2"
            onClick={onEnterBattleRoom}
          >
            Enter Battle Room
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BattleWaitingCard;
