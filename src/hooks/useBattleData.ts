import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Battle, Participant, Vote } from '@/types/battle';

export function useBattle(battleId?: string) {
  return useQuery<Battle | null, Error>({
    queryKey: ['battle', battleId],
    enabled: !!battleId,
    queryFn: async () => {
      if (!battleId) return null;
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('id', battleId)
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        title: data.title,
        status: data.status,
        roundCount: data.round_count,
        type: data.type,
        participants: [], // fetched separately
        spectatorCount: 0, // fetched separately
      } as Battle;
    },
  });
}

export function useBattleParticipants(battleId?: string) {
  return useQuery<Participant[], Error>({
    queryKey: ['battle-participants', battleId],
    enabled: !!battleId,
    queryFn: async () => {
      if (!battleId) return [];
      const { data, error } = await supabase
        .from('battle_participants')
        .select('user_id, profiles(username, avatar_url)')
        .eq('battle_id', battleId);
      if (error) throw new Error(error.message);
      return (data || []).map((p: any) => ({
        id: p.user_id,
        username: p.profiles?.username || 'Unknown',
        avatar_url: p.profiles?.avatar_url || undefined,
      }));
    },
  });
}

export function useSpectatorCount(battleId?: string) {
  return useQuery<number, Error>({
    queryKey: ['spectator-count', battleId],
    enabled: !!battleId,
    queryFn: async () => {
      if (!battleId) return 0;
      const { data, error } = await supabase
        .from('battle_spectators')
        .select('count')
        .eq('battle_id', battleId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data?.count || 0;
    },
    refetchInterval: 5000, // poll for real-time updates
  });
}

export function useBattleVotes(battleId?: string) {
  return useQuery<Vote[], Error>({
    queryKey: ['battle-votes', battleId],
    enabled: !!battleId,
    queryFn: async () => {
      if (!battleId) return [];
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('battle_id', battleId);
      if (error) throw new Error(error.message);
      return data as Vote[];
    },
  });
}

import { useMutation } from '@tanstack/react-query';

interface VoteInput {
  battleId: string;
  voterId: string;
  votedForId: string;
  score: number;
}

export function useVoteMutation() {
  return useMutation<unknown, Error, VoteInput>({
    mutationFn: async ({ battleId, voterId, votedForId, score }) => {
      const { error } = await supabase.from('votes').upsert({
        battle_id: battleId,
        voter_id: voterId,
        voted_for_id: votedForId,
        score,
      });
      if (error) throw new Error(error.message);
      return true;
    },
  });
}
