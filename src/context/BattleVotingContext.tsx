
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { toast } from "@/components/ui/sonner";

interface BattleVotingContextProps {
  userVote: string | null;
  canVote: boolean;
  participantScores: Record<string, number>;
  handleVote: (votedForId: string) => Promise<void>;
  setUserVote: (votedForId: string | null) => void;
  setCanVote: (canVote: boolean) => void;
  setParticipantScores: (scores: Record<string, number>) => void;
}

const BattleVotingContext = createContext<BattleVotingContextProps | undefined>(undefined);

export const BattleVotingProvider = ({ 
  children,
  onVote
}: { 
  children: ReactNode;
  onVote?: (votedForId: string) => Promise<void>;
}) => {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [canVote, setCanVote] = useState(false);
  const [participantScores, setParticipantScores] = useState<Record<string, number>>({});

  // Handle voting
  const handleVote = useCallback(async (votedForId: string): Promise<void> => {
    try {
      if (onVote) {
        await onVote(votedForId);
      }
      setUserVote(votedForId);
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error("Failed to submit vote");
      return Promise.reject(error);
    }
  }, [onVote]);

  return (
    <BattleVotingContext.Provider value={{
      userVote,
      canVote,
      participantScores,
      handleVote,
      setUserVote,
      setCanVote,
      setParticipantScores
    }}>
      {children}
    </BattleVotingContext.Provider>
  );
};

export const useBattleVotingContext = () => {
  const context = useContext(BattleVotingContext);
  if (context === undefined) {
    throw new Error("useBattleVotingContext must be used within a BattleVotingProvider");
  }
  return context;
};
