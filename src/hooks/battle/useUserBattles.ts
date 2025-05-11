
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
      
      console.log(`Deleting battle with ID: ${battleId}`);
      
      // First, delete battle votes associated with the battle
      const { error: votesError } = await supabase
        .from('battle_votes')
        .delete()
        .eq('battle_id', battleId);
        
      if (votesError) {
        console.error("Error deleting battle votes:", votesError);
        throw votesError;
      }
      console.log("Battle votes deleted successfully");
      
      // Delete battle messages associated with the battle
      const { error: messagesError } = await supabase
        .from('battle_messages')
        .delete()
        .eq('battle_id', battleId);
        
      if (messagesError) {
        console.error("Error deleting battle messages:", messagesError);
        throw messagesError;
      }
      console.log("Battle messages deleted successfully");
      
      // Delete roasts associated with the battle
      const { error: roastsError } = await supabase
        .from('roasts')
        .delete()
        .eq('battle_id', battleId);
        
      if (roastsError) {
        console.error("Error deleting roasts:", roastsError);
        throw roastsError;
      }
      console.log("Roasts deleted successfully");
      
      // Delete battle spectators associated with the battle
      const { error: spectatorsError } = await supabase
        .from('battle_spectators')
        .delete()
        .eq('battle_id', battleId);
        
      if (spectatorsError) {
        console.error("Error deleting battle spectators:", spectatorsError);
        throw spectatorsError;
      }
      console.log("Battle spectators deleted successfully");
      
      // Delete battle participants first (due to foreign key constraints)
      const { error: participantsError } = await supabase
        .from('battle_participants')
        .delete()
        .eq('battle_id', battleId);
        
      if (participantsError) {
        console.error("Error deleting battle participants:", participantsError);
        throw participantsError;
      }
      console.log("Battle participants deleted successfully");
      
      // Then delete the battle
      const { error } = await supabase
        .from('battles')
        .delete()
        .eq('id', battleId);
        
      if (error) {
        console.error("Error deleting battle:", error);
        throw error;
      }
      console.log("Battle deleted successfully");
      
      // Update local state to immediately reflect the change
      setBattles(prevBattles => prevBattles.filter(battle => battle.id !== battleId));
      
      toast.success("Battle deleted successfully");
      
    } catch (error: any) {
      console.error("Error in handleDeleteBattle:", error);
      toast.error(`Failed to delete battle: ${error.message}`);
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
