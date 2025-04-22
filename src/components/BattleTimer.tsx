
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Timer, AlertCircle } from "lucide-react";

interface BattleTimerProps {
  initialSeconds: number;
  isActive?: boolean;
  onTimeout?: () => void;
  showWarningAt?: number;
  onTimerUpdate?: (remainingSeconds: number) => void;
}

const BattleTimer = ({
  initialSeconds,
  isActive = true,
  onTimeout,
  showWarningAt = 30,
  onTimerUpdate,
}: BattleTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);
  
  useEffect(() => {
    // Reset seconds when initialSeconds changes
    setSeconds(initialSeconds);
  }, [initialSeconds]);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          
          if (newSeconds === 0 && onTimeout) {
            onTimeout();
          }
          
          if (newSeconds <= showWarningAt) {
            setIsWarning(true);
          }
          
          // Notify parent component about timer update for sync
          if (onTimerUpdate) {
            onTimerUpdate(newSeconds);
          }
          
          return newSeconds;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsWarning(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onTimeout, showWarningAt, onTimerUpdate]);
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  
  const progressValue = (seconds / initialSeconds) * 100;
  
  return (
    <Card className={`p-3 flex flex-col gap-2 ${isWarning ? "border-amber-500" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className={`h-4 w-4 ${isWarning ? "text-amber-500" : ""}`} />
          <span className="font-medium">Time Remaining</span>
        </div>
        <span className={`font-mono font-bold text-lg ${isWarning ? "text-amber-500" : "text-white"}`}>
          {formatTime(seconds)}
        </span>
      </div>
      
      <Progress
        value={progressValue}
        className={`h-2 ${
          isWarning
            ? progressValue <= 20
              ? "bg-ember-500/20"
              : "bg-amber-500/20"
            : "bg-night-700"
        }`}
      />
      
      {isWarning && seconds <= 20 && (
        <div className="flex items-center gap-1 mt-1 text-ember-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>{seconds <= 10 ? "Hurry up!" : "Running out of time!"}</span>
        </div>
      )}
    </Card>
  );
};

export default BattleTimer;
