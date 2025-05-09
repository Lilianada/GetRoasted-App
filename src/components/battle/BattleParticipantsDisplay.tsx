
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Participant {
  profiles?: {
    avatar_url?: string;
    username?: string;
  };
}

interface BattleParticipantsDisplayProps {
  participants: Participant[];
  maxParticipants?: number;
}

const BattleParticipantsDisplay = ({ 
  participants, 
  maxParticipants = 2 
}: BattleParticipantsDisplayProps) => {
  return (
    <div className="flex items-center justify-center gap-12">
      {participants.map((participant, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20 border-2 border-flame-500 rounded-full">
            <AvatarImage src={participant.profiles?.avatar_url} />
            <AvatarFallback className="bg-night-700 text-flame-500">
              {participant.profiles?.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg capitalize">
            {participant.profiles?.username || "Unknown"}
          </span>
        </div>
      ))}
      
      {/* Placeholder for waiting opponent */}
      {participants.length < maxParticipants && (
        <>
          <span className="text-flame-500 font-bold text-xl">VS</span>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 border-2 border-dashed border-night-500 rounded-full flex items-center justify-center">
              <span className="text-night-400 text-3xl">?</span>
            </div>
            <span className="font-semibold text-lg text-night-400">Waiting</span>
          </div>
        </>
      )}
    </div>
  );
};

export default BattleParticipantsDisplay;
