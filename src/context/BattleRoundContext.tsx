
import { createContext, useContext, useState, ReactNode } from "react";

interface BattleRoundContextProps {
  currentRound: number;
  totalRounds: number;
  setCurrentRound: (round: number) => void;
  handleNextRound: () => void;
}

const BattleRoundContext = createContext<BattleRoundContextProps | undefined>(undefined);

export const BattleRoundProvider = ({ 
  children,
  initialCurrentRound = 1,
  initialTotalRounds = 3,
  onNextRound
}: { 
  children: ReactNode;
  initialCurrentRound?: number;
  initialTotalRounds?: number;
  onNextRound?: () => void;
}) => {
  const [currentRound, setCurrentRound] = useState(initialCurrentRound);
  const totalRounds = initialTotalRounds;

  // Handle advancing to the next round
  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
    if (onNextRound) onNextRound();
  };

  return (
    <BattleRoundContext.Provider value={{
      currentRound,
      totalRounds,
      setCurrentRound,
      handleNextRound
    }}>
      {children}
    </BattleRoundContext.Provider>
  );
};

export const useBattleRoundContext = () => {
  const context = useContext(BattleRoundContext);
  if (context === undefined) {
    throw new Error("useBattleRoundContext must be used within a BattleRoundProvider");
  }
  return context;
};
