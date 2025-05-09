
import React from "react";
import { Timer } from "lucide-react";

interface BattleTimerProps {
  timePerTurn: number;
}

const BattleTimer = ({ timePerTurn }: BattleTimerProps) => {
  // Format time to display minutes and seconds if needed
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      return minutes === 1 ? `1 minute` : `${minutes} minutes`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex justify-center items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-lg">
      <Timer className="w-5 h-5 text-flame-500" />
      <span>Time per turn: {formatTime(timePerTurn)}</span>
    </div>
  );
};

export default BattleTimer;
