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
      // Optionally, show a toast to the user if fetching fails
      toast({
        title: "Error",
        description: "Could not fetch your battles. Please try again.",
        variant: "destructive",
      });
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
      console.log(`Attempting to delete battle with ID: ${battleId}`);
      
      // Only need to delete the battle itself; related data will be deleted by CASCADE rules
      const { error: battleError } = await supabase
        .from('battles')
        .delete()
        .eq('id', battleId);
      
      if (battleError) {
        console.error("Error deleting battle:", battleError);
        throw new Error(`Failed to delete battle: ${battleError.message}`);
      }
      
      console.log("Battle successfully deleted. Related data handled by CASCADE rules.");
      
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
