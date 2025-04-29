
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useBattleContext } from '@/context/BattleContext';

interface BattleTimerDisplayProps {
  className?: string;
}

const BattleTimerDisplay: React.FC<BattleTimerDisplayProps> = ({ className }) => {
  const { timeRemaining, timePercentage, formatTime } = useBattleContext();

  return (
    <div className={className}>
      <div className="flex justify-end mb-2">
        <Badge variant={timeRemaining < 30 ? "destructive" : "outline"} className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(timeRemaining)}
        </Badge>
      </div>
      <Progress value={timePercentage} className="h-2" />
    </div>
  );
};

export default BattleTimerDisplay;
