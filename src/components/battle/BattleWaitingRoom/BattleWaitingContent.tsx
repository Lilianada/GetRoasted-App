
import React from "react";
import BattleCodeDisplay from "../BattleCodeDisplay";
import BattleParticipantsDisplay from "../BattleParticipantsDisplay";
import BattleReadyConfirmation from "../BattleReadyConfirmation";
import BattleTimer from "./BattleTimer";

interface BattleWaitingContentProps {
  inviteCode: string;
  onInviteContacts: () => void;
  timePerTurn: number;
  participants: any[];
  battleId: string;
  onBothPlayersReady: () => void;
}

const BattleWaitingContent = ({
  inviteCode,
  onInviteContacts,
  timePerTurn,
  participants,
  battleId,
  onBothPlayersReady
}: BattleWaitingContentProps) => {
  return (
    <div className="space-y-6">
      {/* Battle code display component */}
      <BattleCodeDisplay 
        inviteCode={inviteCode || '------'} 
        onInviteContacts={onInviteContacts} 
      />
    
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Battle Timer Info */}
        <BattleTimer timePerTurn={timePerTurn} />
        
        {/* Battle participants display */}
        <BattleParticipantsDisplay 
          participants={participants}
          maxParticipants={2}
        />
        
        {/* Ready confirmation for starting the battle */}
        {participants.length > 0 && (
          <BattleReadyConfirmation 
            battleId={battleId || ''}
            onBothPlayersReady={onBothPlayersReady}
            participantCount={participants.length}
          />
        )}
      </div>
    </div>
  );
};

export default BattleWaitingContent;
