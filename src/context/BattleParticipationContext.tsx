
import { createContext, useContext, useState, ReactNode } from "react";

interface BattleParticipationContextProps {
  isSpectator: boolean;
  spectatorCount: number;
  currentTurnUserId: string | undefined;
  setIsSpectator: (isSpectator: boolean) => void;
  setSpectatorCount: (count: number) => void;
  setCurrentTurnUserId: (userId: string | undefined) => void;
  isPlayerTurn: () => boolean;
  userId?: string;
}

const BattleParticipationContext = createContext<BattleParticipationContextProps | undefined>(undefined);

export const BattleParticipationProvider = ({ 
  children,
  userId
}: { 
  children: ReactNode;
  userId?: string;
}) => {
  const [isSpectator, setIsSpectator] = useState(true);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [currentTurnUserId, setCurrentTurnUserId] = useState<string | undefined>();

  const isPlayerTurn = () => {
    if (!userId || isSpectator) return false;
    return currentTurnUserId === userId;
  };

  return (
    <BattleParticipationContext.Provider value={{
      isSpectator,
      spectatorCount,
      currentTurnUserId,
      setIsSpectator,
      setSpectatorCount,
      setCurrentTurnUserId,
      isPlayerTurn,
      userId
    }}>
      {children}
    </BattleParticipationContext.Provider>
  );
};

export const useBattleParticipationContext = () => {
  const context = useContext(BattleParticipationContext);
  if (context === undefined) {
    throw new Error("useBattleParticipationContext must be used within a BattleParticipationProvider");
  }
  return context;
};
