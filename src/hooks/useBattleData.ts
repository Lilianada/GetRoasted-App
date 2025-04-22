
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Vote } from '@/types/vote';

export type BattleData = {
  id: string;
  title: string;
  status: string;
  type: string;
  round_count: number;
  time_per_turn: number;
  allow_spectators: boolean;
  created_at: string;
  created_by: string | null;
};

export type BattleParticipant = {
  id: string;
  user_id: string;
  battle_id: string;
  joined_at: string;
  username?: string;
  avatar_url?: string;
};

export function useBattleData(battleId: string | undefined) {
  const [battle, setBattle] = useState<BattleData | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!battleId) {
      setIsLoading(false);
      return;
    }

    const fetchBattleData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch battle details
        const { data: battleData, error: battleError } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();
          
        if (battleError) throw new Error(battleError.message);
        
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
        
        // Fetch votes for this battle
        const { data: votesData, error: votesError } = await supabase
          .from('battle_votes')
          .select('*')
          .eq('battle_id', battleId);
          
        if (votesError) throw new Error(votesError.message);
        
        setBattle(battleData);
        setParticipants(mappedParticipants);
        setVotes(votesData as Vote[]);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching battle data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBattleData();
    
    // Subscribe to battle changes
    const battleChannel = supabase
      .channel(`battle-changes-${battleId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` }, 
        (payload) => {
          setBattle(payload.new as BattleData);
      })
      .subscribe();
      
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
      supabase.removeChannel(battleChannel);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(votesChannel);
    };
  }, [battleId]);
  
  return { battle, participants, votes, isLoading, error };
}
