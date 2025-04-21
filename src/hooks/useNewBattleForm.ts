import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

export function useNewBattleForm() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [battleType, setBattleType] = useState<'public' | 'private'>('public');
  const [roundCount, setRoundCount] = useState("3");
  const [timePerTurn, setTimePerTurn] = useState("180");
  const [allowSpectators, setAllowSpectators] = useState(true);
  const [quickMatch, setQuickMatch] = useState(false);
  const [battleId, setBattleId] = useState<string | null>(null);

  const handleCreateBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create battles");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a battle title");
      return;
    }
    if (!timePerTurn || isNaN(Number(timePerTurn)) || Number(timePerTurn) <= 0) {
      toast.error("Please provide a valid time per turn.");
      return;
    }
    setIsCreating(true);
    try {
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .insert({
          title,
          type: battleType,
          round_count: parseInt(roundCount),
          time_per_turn: Number(timePerTurn),
          created_by: user.id,
          status: 'waiting',
          allow_spectators: allowSpectators
        })
        .select()
        .single();
      if (battleError) throw battleError;
      const { error: participantError } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: battleData.id,
          user_id: user.id
        });
      if (participantError) throw participantError;
      toast.success("Battle created successfully!");
      navigate(`/battle/waiting/${battleData.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create battle");
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
    quickMatch, setQuickMatch,
    battleId, setBattleId,
    handleCreateBattle
  };
}
