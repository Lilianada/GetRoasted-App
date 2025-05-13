
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useUserBattles = (userId: string | undefined) => {
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUserBattles = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*, battle_participants(user_id)')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBattles(data || []);
      console.log("Fetched battles:", data);
    } catch (error) {
      console.error("Error fetching battles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

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
    if (!battleId) {
      console.error("No battle ID provided for deletion");
      toast({
        title: "Error",
        description: "Could not delete battle: Invalid battle ID",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setDeletingId(battleId);
      console.log(`Deleting battle with ID: ${battleId}`);
      
      // Step 1: Delete votes
      const { error: votesError } = await supabase
        .from('battle_votes')
        .delete()
        .eq('battle_id', battleId);
      
      if (votesError) {
        console.error("Error deleting battle votes:", votesError);
        throw new Error(`Failed to delete battle votes: ${votesError.message}`);
      }
      
      // Step 2: Delete messages
      const { error: messagesError } = await supabase
        .from('battle_messages')
        .delete()
        .eq('battle_id', battleId);
      
      if (messagesError) {
        console.error("Error deleting battle messages:", messagesError);
        throw new Error(`Failed to delete battle messages: ${messagesError.message}`);
      }
      
      // Step 3: Delete roasts
      const { error: roastsError } = await supabase
        .from('roasts')
        .delete()
        .eq('battle_id', battleId);
      
      if (roastsError) {
        console.error("Error deleting roasts:", roastsError);
        throw new Error(`Failed to delete roasts: ${roastsError.message}`);
      }
      
      // Step 4: Delete spectators
      const { error: spectatorsError } = await supabase
        .from('battle_spectators')
        .delete()
        .eq('battle_id', battleId);
      
      if (spectatorsError) {
        console.error("Error deleting battle spectators:", spectatorsError);
        throw new Error(`Failed to delete battle spectators: ${spectatorsError.message}`);
      }
      
      // Step 5: Delete participants
      const { error: participantsError } = await supabase
        .from('battle_participants')
        .delete()
        .eq('battle_id', battleId);
      
      if (participantsError) {
        console.error("Error deleting battle participants:", participantsError);
        throw new Error(`Failed to delete battle participants: ${participantsError.message}`);
      }
      
      // Step 6: Finally, delete the battle
      const { error: battleError } = await supabase
        .from('battles')
        .delete()
        .eq('id', battleId);
      
      if (battleError) {
        console.error("Error deleting battle:", battleError);
        throw new Error(`Failed to delete battle: ${battleError.message}`);
      }
      
      console.log("Battle and all related data successfully deleted");
      
      // Update local state to reflect the deletion
      setBattles(prevBattles => prevBattles.filter(battle => battle.id !== battleId));
      
      toast({
        title: "Success",
        description: "Battle deleted successfully",
      });
      
    } catch (error: any) {
      console.error("Error in handleDeleteBattle:", error);
      toast({
        title: "Error",
        description: `Failed to delete battle: ${error.message}`,
        variant: "destructive",
      });
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
