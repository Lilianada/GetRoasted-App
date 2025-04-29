
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Vote } from '@/types/vote';

/**
 * Hook to fetch and subscribe to battle votes
 */
export function useBattleVotes(battleId: string | undefined) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!battleId) {
      setIsLoading(false);
      return;
    }

    const fetchVotes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch votes for this battle
        const { data: votesData, error: votesError } = await supabase
          .from('battle_votes')
          .select('*')
          .eq('battle_id', battleId);
          
        if (votesError) throw new Error(votesError.message);
        
        setVotes(votesData as Vote[]);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching battle votes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVotes();
    
    // Subscribe to votes changes
    const votesChannel = supabase
      .channel(`votes-changes-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_votes', filter: `battle_id=eq.${battleId}` }, 
        () => {
          // Re-fetch votes when there's a change
          supabase
            .from('battle_votes')
            .select('*')
            .eq('battle_id', battleId)
            .then(({ data }) => {
              if (data) setVotes(data as Vote[]);
            });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(votesChannel);
    };
  }, [battleId]);
  
  return { votes, isLoading, error };
}

/**
 * Hook that provides voting mutation functionality
 */
export function useVoteMutation() {
  return {
    mutate: async ({ battleId, voterId, votedForId, score }: { battleId: string, voterId: string, votedForId: string, score: number }, 
    { onSuccess, onError }: { onSuccess?: () => void, onError?: (error: Error) => void } = {}) => {
      try {
        const { error } = await supabase
          .from('battle_votes')
          .insert({
            battle_id: battleId,
            voter_id: voterId,
            voted_for_user_id: votedForId,
            score: score
          });
        
        if (error) throw new Error(error.message);
        if (onSuccess) onSuccess();
      } catch (err: any) {
        if (onError) onError(err);
        throw err;
      }
    },
    mutateAsync: async ({ battleId, voterId, votedForId, score }: { battleId: string, voterId: string, votedForId: string, score: number }) => {
      const { error } = await supabase
        .from('battle_votes')
        .insert({
          battle_id: battleId,
          voter_id: voterId,
          voted_for_user_id: votedForId,
          score: score
        });
      
      if (error) throw new Error(error.message);
      return;
    }
  };
}
