import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Timer, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import BattleStatusBadge from './battle/BattleStatusBadge';

const MAX_PARTICIPANTS = 2;

// Render a participant avatar and name, or an empty slot if undefined
function renderParticipant(participant: { id: string; name: string; avatar?: string } | undefined, idx: number) {
  if (participant) {
    const initials = participant.name ? participant.name.substring(0, 2).toUpperCase() : "??";
    return (
      <div key={participant.id}>
        <div className="flex flex-col items-center text-center gap-1.5">
          <Avatar className="h-14 w-14 border-2 border-flame-500 rounded-full">
            <AvatarImage src={participant.avatar} alt={participant.name || "Participant avatar"} />
            <AvatarFallback className="bg-night-700 text-flame-500">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold truncate max-w-[80px]" title={participant.name}>{participant.name}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div key={`empty-${idx}`} aria-label="Empty participant slot" role="img">
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="h-14 w-14 border-2 border-dashed border-night-700 rounded-full flex items-center justify-center">
            <span className="text-night-400" aria-hidden>?</span>
          </div>
          <span className="text-sm font-semibold text-night-400">Waiting</span>
        </div>
      </div>
    );
  }
}

interface BattleCardProps {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  spectatorCount: number;
  status: 'waiting' | 'ready' | 'active' | 'completed';
  timeRemaining?: number;
  type: 'public' | 'private';
  roundCount: number;
  timePerTurn?: number;
}

const BattleCard = ({
  id,
  title,
  participants = [],
  spectatorCount = 0,
  status,
  timeRemaining,
  type,
  roundCount = 1,
  timePerTurn = 180,
}: BattleCardProps) => {
  const formatTime = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (seconds?: number) => {
    if (!seconds) return '--';
    return `${Math.floor(seconds / 60)} min`;
  };

  const isBattleFull = (participants?.length ?? 0) >= 2;

  return (
    <Card className={`
      relative transform transition-all duration-200 
      hover:-translate-y-1 hover:translate-x-1
      bg-secondary border-2 border-black rounded-xl overflow-hidden
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
    `}>
      <CardHeader className="pb-3 border-b-2 border-black">
        <div className="flex flex-col justify-between items-start">
          <BattleStatusBadge status={status} />
          <CardTitle className="text-base sm:text-lg text-black">{title}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-4 text-black">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {participants.length}/2
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {spectatorCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer className="h-3.5 w-3.5" />
            {timeRemaining ? formatTime(timeRemaining) : formatMinutes(timePerTurn)}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center justify-center gap-4 py-4" aria-label="Battle participants">
          {Array.from({ length: MAX_PARTICIPANTS }).map((_, idx) =>
            renderParticipant(participants?.[idx], idx)
          )}
          {MAX_PARTICIPANTS === 2 && <span className="text-flame-500 font-bold" aria-hidden>VS</span>}
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t-2 border-black pt-4">
        <div className="text-xs text-black font-medium">
          <span className="inline-flex items-center gap-1">
            Rounds: {typeof roundCount === 'number' && roundCount > 0 ? roundCount : ' '} • {type === 'private' ? 'Private' : 'Public'}
          </span>
        </div>
        <Button
          asChild
          className="bg-primary text-black border-2 border-black hover:bg-primary/90 shadow-neo hover:shadow-neo-hover"
        >
          {status === 'waiting' && !isBattleFull ? (
            <Link to={`/battles/waiting/${id}`}>
              Join Battle
            </Link>
          ) : status === 'waiting' && isBattleFull ? (
            <Link to={`/battles/waiting/${id}`}>
              Battle Full
            </Link>
          ) : status === 'ready' || status === 'active' ? (
            <Link to={isBattleFull ? `/battles/live/${id}` : `/battles/waiting/${id}`}>
              {isBattleFull ? "Watch" : "Join as Spectator"}
            </Link>
          ) : (
            <Link to={`/battles/${id}`}>
              View Results
            </Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BattleCard;
