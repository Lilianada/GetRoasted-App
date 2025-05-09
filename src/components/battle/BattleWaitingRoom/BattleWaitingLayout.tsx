
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import BattleWaitingHeader from "../BattleWaitingHeader";
import BattleWaitingContent from "./BattleWaitingContent";
import BattleWaitingFooter from "./BattleWaitingFooter";

interface BattleWaitingLayoutProps {
  title: string;
  participants: any[];
  inviteCode: string;
  timePerTurn: number;
  battleId: string;
  onInviteContacts: () => void;
  onBothPlayersReady: () => void;
  onBack: () => void;
  onEnterBattle: () => void;
}

const BattleWaitingLayout = ({
  title,
  participants,
  inviteCode,
  timePerTurn,
  battleId,
  onInviteContacts,
  onBothPlayersReady,
  onBack,
  onEnterBattle
}: BattleWaitingLayoutProps) => {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <BattleWaitingHeader 
          title={title} 
          participantsCount={participants.length} 
        />
      </CardHeader>
      
      <CardContent>
        <BattleWaitingContent
          inviteCode={inviteCode}
          onInviteContacts={onInviteContacts}
          timePerTurn={timePerTurn}
          participants={participants}
          battleId={battleId}
          onBothPlayersReady={onBothPlayersReady}
        />
      </CardContent>
      
      <CardFooter>
        <BattleWaitingFooter
          onBack={onBack}
          onEnterBattle={onEnterBattle}
          showEnterButton={participants.length >= 1}
        />
      </CardFooter>
    </Card>
  );
};

export default BattleWaitingLayout;
