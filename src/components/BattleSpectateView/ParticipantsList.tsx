import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface Participant {
  user_id: string;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

interface ParticipantsListProps {
  participants: Participant[];
  user: any;
  battleId: string;
  onVote: (userId: string, username: string) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, user, battleId, onVote }) => {
  return (
    <div className="space-y-3">
      {participants.map((p) => (
        <Button 
          key={p.user_id} 
          variant="outline" 
          className="flex items-center gap-3"
          onClick={() => onVote(p.user_id, p.profile.username)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={p.profile.avatar_url || undefined} />
            <AvatarFallback>{p.profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>Vote for {p.profile.username}</span>
        </Button>
      ))}
    </div>
  );
};

export default ParticipantsList;
