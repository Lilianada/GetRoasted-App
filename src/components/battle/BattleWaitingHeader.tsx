
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface BattleWaitingHeaderProps {
  title: string;
  participantsCount: number;
}

const BattleWaitingHeader = ({ title, participantsCount }: BattleWaitingHeaderProps) => {
  return (
    <>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>
        {participantsCount < 2 
          ? "Waiting for opponent to join..." 
          : "Both players must type 'Start' to begin"}
      </CardDescription>
    </>
  );
};

export default BattleWaitingHeader;
