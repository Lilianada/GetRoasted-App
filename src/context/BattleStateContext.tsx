
import { createContext, useContext, useState, ReactNode } from "react";

interface BattleStateContextProps {
  battleState: 'waiting' | 'ready' | 'active' | 'completed';
  battleEnded: boolean;
  winner: any;
  showRoundSummary: boolean;
  setBattleState: (state: 'waiting' | 'ready' | 'active' | 'completed') => void;
  setBattleEnded: (ended: boolean) => void;
  setWinner: (winner: any) => void;
  setShowRoundSummary: (show: boolean) => void;
}

const BattleStateContext = createContext<BattleStateContextProps | undefined>(undefined);

export const BattleStateProvider = ({ 
  children,
  initialState = 'waiting',
  initialEnded = false,
  initialShowSummary = false
}: { 
  children: ReactNode;
  initialState?: 'waiting' | 'ready' | 'active' | 'completed';
  initialEnded?: boolean;
  initialShowSummary?: boolean;
}) => {
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>(initialState);
  const [battleEnded, setBattleEnded] = useState(initialEnded);
  const [winner, setWinner] = useState<any>(null);
  const [showRoundSummary, setShowRoundSummary] = useState(initialShowSummary);

  return (
    <BattleStateContext.Provider value={{
      battleState,
      battleEnded,
      winner,
      showRoundSummary,
      setBattleState,
      setBattleEnded,
      setWinner,
      setShowRoundSummary
    }}>
      {children}
    </BattleStateContext.Provider>
  );
};

export const useBattleStateContext = () => {
  const context = useContext(BattleStateContext);
  if (context === undefined) {
    throw new Error("useBattleStateContext must be used within a BattleStateProvider");
  }
  return context;
};
