import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Voting panel for spectators to choose a winner after the battle ends.
 * participants: array of { id, username, avatar_url }
 * onVote: callback with voted user id
 */
export function BattleVotePanel({ participants, onVote, disabled, votedFor }: {
  participants: { id: string, username: string, avatar_url?: string }[];
  onVote: (userId: string) => void;
  disabled?: boolean;
  votedFor?: string | null;
}) {
  return (
    <div className="flex flex-col gap-4 items-center py-6">
      <h2 className="text-xl font-bold mb-2">Vote for the Winner!</h2>
      <div className="flex gap-4">
        {participants.map(p => (
          <Button
            key={p.id}
            className={`flex flex-col items-center gap-2 border-2 ${votedFor === p.id ? 'border-green-500' : 'border-black'}`}
            onClick={() => onVote(p.id)}
            disabled={disabled || !!votedFor}
          >
            <img src={p.avatar_url || "/placeholder.svg"} alt={p.username} className="w-12 h-12 rounded-full border" />
            <span className="font-semibold">{p.username}</span>
            {votedFor === p.id && <span className="text-green-600 font-bold">Voted</span>}
          </Button>
        ))}
      </div>
      {votedFor && <div className="mt-2 text-green-600">Thank you for voting!</div>}
    </div>
  );
}
