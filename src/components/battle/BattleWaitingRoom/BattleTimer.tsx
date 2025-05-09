
import React from "react";
import { Timer } from "lucide-react";

interface BattleTimerProps {
  timePerTurn: number;
}

const BattleTimer = ({ timePerTurn }: BattleTimerProps) => {
  return (
    <div className="w-full flex justify-center items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-lg">
      <Timer className="w-5 h-5 text-flame-500" />
      <span>Time per turn: {timePerTurn / 60} minutes</span>
    </div>
  );
};

export default BattleTimer;
