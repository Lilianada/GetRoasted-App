
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface BattleTimerContextProps {
  timeRemaining: number;
  timePerTurn: number;
  timePercentage: number;
  formatTime: (seconds: number) => string;
  handleTimerUpdate: (newTime: number) => void;
  setTimePerTurn: (time: number) => void;
}

const BattleTimerContext = createContext<BattleTimerContextProps | undefined>(undefined);

export const BattleTimerProvider = ({ 
  children,
  initialTimePerTurn = 180,
  syncTimer
}: { 
  children: ReactNode;
  initialTimePerTurn?: number;
  syncTimer?: (time: number) => void;
}) => {
  const [timePerTurn, setTimePerTurn] = useState(initialTimePerTurn);
  const [timeRemaining, setTimeRemaining] = useState(initialTimePerTurn);

  // Calculate the percentage of time remaining
  const timePercentage = (timeRemaining / timePerTurn) * 100;

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Handle timer updates
  const handleTimerUpdate = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    if (syncTimer) syncTimer(newTime);
  }, [syncTimer]);

  return (
    <BattleTimerContext.Provider value={{
      timeRemaining,
      timePerTurn,
      timePercentage,
      formatTime,
      handleTimerUpdate,
      setTimePerTurn
    }}>
      {children}
    </BattleTimerContext.Provider>
  );
};

export const useBattleTimerContext = () => {
  const context = useContext(BattleTimerContext);
  if (context === undefined) {
    throw new Error("useBattleTimerContext must be used within a BattleTimerProvider");
  }
  return context;
};
