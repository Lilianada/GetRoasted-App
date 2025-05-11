
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserBattles = (userId: string | undefined) => {
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserBattles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('battles')
          .select('*, battle_participants(user_id)')
          .eq('created_by', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBattles(data || []);
      } catch (error) {
        console.error("Error fetching battles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBattles();

    // Set up realtime listener for updates
    const channel = supabase
      .channel('user-battles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battles', filter: `created_by=eq.${userId}` }, 
        fetchUserBattles
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleDeleteBattle = async (battleId: string) => {
    try {
      setDeletingId(battleId);
      
      // First, delete battle votes associated with the battle
      const { error: votesError } = await supabase
        .from('battle_votes')
        .delete()
        .eq('battle_id', battleId);
        
      if (votesError) throw votesError;
      
      // Delete battle messages associated with the battle
      const { error: messagesError } = await supabase
        .from('battle_messages')
        .delete()
        .eq('battle_id', battleId);
        
      if (messagesError) throw messagesError;
      
      // Delete roasts associated with the battle
      const { error: roastsError } = await supabase
        .from('roasts')
        .delete()
        .eq('battle_id', battleId);
        
      if (roastsError) throw roastsError;
      
      // Delete battle spectators associated with the battle
      const { error: spectatorsError } = await supabase
        .from('battle_spectators')
        .delete()
        .eq('battle_id', battleId);
        
      if (spectatorsError) throw spectatorsError;
      
      // Delete battle participants first (due to foreign key constraints)
      const { error: participantsError } = await supabase
        .from('battle_participants')
        .delete()
        .eq('battle_id', battleId);
        
      if (participantsError) throw participantsError;
      
      // Then delete the battle
      const { error } = await supabase
        .from('battles')
        .delete()
        .eq('id', battleId);
        
      if (error) throw error;
      
      // Update local state to immediately reflect the change
      setBattles(prevBattles => prevBattles.filter(battle => battle.id !== battleId));
      
      toast.success("Battle deleted successfully");
      
    } catch (error: any) {
      toast.error(`Failed to delete battle: ${error.message}`);
      console.error("Error deleting battle:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return {
    battles,
    loading,
    deletingId,
    handleDeleteBattle
  };
};
