import { createContext, useContext, ReactNode } from "react";
import { Battle, Participant } from "@/types/battle";
import { useBattle } from "@/hooks/battle/useBattleData";
import { BattleProviders } from "./BattleProviders";
import { BattleContextConsumer } from "./BattleContextConsumer";
import { useAuthContext } from "@/context/AuthContext";

// Combined context interface
interface BattleContextProps {
  battleId: string | undefined;
  battle: Battle | null;
  participants: Participant[];
  isSpectator: boolean;
  currentRound: number;
  totalRounds: number;
  currentTurnUserId: string | undefined;
  timeRemaining: number;
  timePerTurn: number;
  timePercentage: number;
  battleState: 'waiting' | 'ready' | 'active' | 'completed';
  showRoundSummary: boolean;
  battleEnded: boolean;
  winner: any;
  spectatorCount: number;
  participantScores: Record<string, number>;
  userVote: string | null;
  canVote: boolean;
  isPlayerTurn: () => boolean;
  formatTime: (seconds: number) => string;
  handleSendRoast: (content: string) => Promise<void>;
  handleNextRound: () => void;
  handleRematch: () => Promise<void>;
  handleVote: (votedForId: string) => Promise<void>;
  handleTimerUpdate: (newTime: number) => void;
  setShowRoundSummary: (value: boolean) => void;
  setBattleState: (state: 'waiting' | 'ready' | 'active' | 'completed') => void;
  setSpectatorCount: (count: number) => void;
  setCurrentRound: (round: number) => void;
  isLoading: boolean;
  error: any;
}

export const BattleContext = createContext<BattleContextProps | undefined>(undefined);

// Main wrapper for all battle context providers
export const BattleProvider = ({ 
  children, 
  battleId 
}: { 
  children: ReactNode; 
  battleId: string | undefined;
}) => {
  // Import auth context to get current user
  const { data: battle, isLoading, error } = useBattle(battleId);
  
  // Get current user from auth context
  const { user } = useAuthContext();
  
  return (
    <BattleProviders
      battleId={battleId}
      userId={user?.id}
      battle={battle}
    >
      <BattleContextConsumer 
        battleId={battleId}
        isLoading={isLoading}
        error={error}
      >
        {children}
      </BattleContextConsumer>
    </BattleProviders>
  );
};

export const useBattleContext = () => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error("useBattleContext must be used within a BattleProvider");
  }
  return context;
};

// Re-export from BattleContext.tsx since we're keeping the original filename
