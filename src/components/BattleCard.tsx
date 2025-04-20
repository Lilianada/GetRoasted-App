import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Timer, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface BattleCardProps {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  spectatorCount: number;
  status: 'waiting' | 'active' | 'completed';
  timeRemaining?: number;
  type: 'public' | 'private';
  roundCount: number;
}

const BattleCard = ({
  id,
  title,
  participants,
  spectatorCount,
  status,
  timeRemaining,
  type,
  roundCount,
}: BattleCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'waiting': return 'bg-[#F8C537] text-black border-2 border-black';
      case 'active': return 'bg-[#C5B4F0] text-black border-2 border-black';
      case 'completed': return 'bg-[#FFB4A8] text-black border-2 border-black';
      default: return '';
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`
      relative transform transition-all duration-200 
      hover:-translate-y-1 hover:translate-x-1
      bg-[#A6C7F7] border-2 border-black rounded-xl overflow-hidden
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
    `}>
      <CardHeader className="pb-3 border-b-2 border-black">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-black">{title}</CardTitle>
          <Badge variant="outline" className={`${getStatusColor()} uppercase text-xs font-bold`}>
            {status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 text-black">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {participants.length}/3
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {spectatorCount}
          </span>
          {timeRemaining && (
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {formatTime(timeRemaining)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-center gap-4 py-4">
          {participants.map((participant, index) => (
            <React.Fragment key={participant.id}>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Avatar className="h-14 w-14 border-2 border-night-700">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback className="bg-night-700 text-flame-500">{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold truncate max-w-[80px]">{participant.name}</span>
              </div>
              
              {index < participants.length - 1 && (
                <span className="text-flame-500 font-bold">VS</span>
              )}
            </React.Fragment>
          ))}

          {participants.length === 1 && (
            <>
              <span className="text-flame-500 font-bold">VS</span>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="h-14 w-14 border-2 border-dashed border-night-700 rounded-full flex items-center justify-center">
                  <span className="text-night-400">?</span>
                </div>
                <span className="text-sm font-semibold text-night-400">Waiting...</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="justify-between border-t-2 border-black pt-4">
        <div className="text-xs text-black font-medium">
          <span className="inline-flex items-center gap-1">
            {roundCount} Rounds • {type === 'private' ? 'Private' : 'Public'}
          </span>
        </div>
        <Button 
          asChild
          className="bg-[#F8C537] text-black border-2 border-black hover:bg-[#F8C537]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <Link to={`/battle/${id}`}>
            {status === 'waiting' ? 'Join Battle' : status === 'active' ? 'Watch' : 'View Results'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BattleCard;
