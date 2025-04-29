
import { createContext, useContext, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { BattleInfo } from "@/hooks/battle/useBattleInfo";

interface BattleActionsContextProps {
  handleSendRoast: (content: string) => Promise<void>;
  handleRematch: () => Promise<void>;
}

const BattleActionsContext = createContext<BattleActionsContextProps | undefined>(undefined);

export const BattleActionsProvider = ({ 
  children,
  battleId,
  userId,
  battle,
  currentRound,
  onRoastSent
}: { 
  children: ReactNode;
  battleId?: string;
  userId?: string;
  battle: BattleInfo | null;
  currentRound: number;
  onRoastSent?: () => void;
}) => {
  const navigate = useNavigate();

  // Handle sending a roast
  const handleSendRoast = useCallback(async (content: string): Promise<void> => {
    if (content.trim() === "") return Promise.resolve();
    
    try {
      if (!userId || !battleId) {
        toast.error("Unable to send roast. Please try again.");
        return Promise.resolve();
      }
      
      const { error } = await supabase
        .from('roasts')
        .insert({
          battle_id: battleId,
          user_id: userId,
          content: content,
          round_number: currentRound
        });
      
      if (error) throw error;
      
      toast.success("Roast submitted!");
      
      if (onRoastSent) {
        onRoastSent();
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending roast:', error);
      toast.error("Failed to send roast. Please try again.");
      return Promise.reject(error);
    }
  }, [battleId, userId, currentRound, onRoastSent]);

  // Handle rematch
  const handleRematch = useCallback(async (): Promise<void> => {
    if (!battleId || !userId) return Promise.resolve();
    
    try {
      // Create a new battle with the same settings
      const { data, error } = await supabase
        .from('battles')
        .insert({
          title: `Rematch: ${battle?.title}`,
          type: battle?.type,
          status: 'waiting',
          round_count: battle?.round_count,
          time_per_turn: battle?.time_per_turn,
          allow_spectators: battle?.allow_spectators,
          created_by: userId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Navigate to the new battle
        navigate(`/battles/${data.id}`);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating rematch:', error);
      toast.error("Failed to create rematch. Please try again.");
      return Promise.reject(error);
    }
  }, [battleId, userId, battle, navigate]);

  return (
    <BattleActionsContext.Provider value={{
      handleSendRoast,
      handleRematch
    }}>
      {children}
    </BattleActionsContext.Provider>
  );
};

export const useBattleActionsContext = () => {
  const context = useContext(BattleActionsContext);
  if (context === undefined) {
    throw new Error("useBattleActionsContext must be used within a BattleActionsProvider");
  }
  return context;
};
