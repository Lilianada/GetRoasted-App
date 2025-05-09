
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";
import { useBattleCode } from "@/hooks/useBattleCode";

export function useNewBattleForm() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { generateBattleCode } = useBattleCode();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [battleType, setBattleType] = useState<'public' | 'private'>('private'); // Changed default to private
  const [roundCount, setRoundCount] = useState("1"); // Set default to 1 round
  const [timePerTurn, setTimePerTurn] = useState("180"); // Default to 3 minutes
  const [allowSpectators, setAllowSpectators] = useState(true);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const handleCreateBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create battles");
      return null;
    }
    if (!title.trim()) {
      toast.error("Please provide a battle title");
      return null;
    }
    if (!timePerTurn || isNaN(Number(timePerTurn)) || Number(timePerTurn) <= 0) {
      toast.error("Please provide a valid time per turn.");
      return null;
    }
    setIsCreating(true);
    
    try {
      // Generate a unique battle code
      const code = generateBattleCode();
      
      // Create the battle with the code
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .insert({
          title,
          type: battleType,
          round_count: parseInt(roundCount),
          time_per_turn: Number(timePerTurn),
          created_by: user.id,
          status: 'waiting',
          allow_spectators: allowSpectators,
          invite_code: code,
          player_ready_status: {}
        })
        .select()
        .single();
        
      if (battleError) throw battleError;
      
      // Add user as a participant
      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id
        });
        
      if (participantError) throw participantError;
      
      setBattleId(battleData.id);
      setInviteCode(code);
      toast.success("Battle created successfully!");
      navigate(`/battles/waiting/${battleData.id}`);
      return battleData.id;
    } catch (error: any) {
      toast.error(error.message || "Failed to create battle");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    title, setTitle,
    battleType, setBattleType,
    roundCount, setRoundCount,
    timePerTurn, setTimePerTurn,
    allowSpectators, setAllowSpectators,
    battleId, setBattleId,
    inviteCode, setInviteCode,
    handleCreateBattle
  };
}
