
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BattleParticipant } from '@/types/battle';

/**
 * Hook to fetch and subscribe to battle participants
 */
export function useBattleParticipants(battleId: string | undefined) {
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!battleId) {
      setIsLoading(false);
      return;
    }

    const fetchParticipants = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch battle participants with their profiles
        const { data: participantsData, error: participantsError } = await supabase
          .from('battle_participants')
          .select(`
            *,
            profiles:user_id(username, avatar_url)
          `)
          .eq('battle_id', battleId);
          
        if (participantsError) throw new Error(participantsError.message);
        
        // Map participant data to include username and avatar
        const mappedParticipants = participantsData.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          battle_id: p.battle_id,
          joined_at: p.joined_at,
          username: p.profiles?.username,
          avatar_url: p.profiles?.avatar_url
        }));
        
        setParticipants(mappedParticipants);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching battle participants:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchParticipants();
    
    // Subscribe to participants changes  
    const participantsChannel = supabase
      .channel(`participants-changes-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
        () => {
          // Re-fetch participants when there's a change
          supabase
            .from('battle_participants')
            .select(`
              *,
              profiles:user_id(username, avatar_url)
            `)
            .eq('battle_id', battleId)
            .then(({ data }) => {
              if (data) {
                const mapped = data.map((p: any) => ({
                  id: p.id,
                  user_id: p.user_id,
                  battle_id: p.battle_id,
                  joined_at: p.joined_at,
                  username: p.profiles?.username,
                  avatar_url: p.profiles?.avatar_url
                }));
                setParticipants(mapped);
              }
            });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [battleId]);
  
  return { participants, isLoading, error };
}

/**
 * Adapter hook for backward compatibility with existing code
 */
export function useBattleParticipantsAdapter(battleId: string | undefined) {
  const { participants, isLoading, error } = useBattleParticipants(battleId);
  return { data: participants, isLoading, isError: !!error, error };
}
