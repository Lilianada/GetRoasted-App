import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BattleParticipant, BattleSpectator } from '@/types/battle';
import { toast } from '@/components/ui/sonner';

interface UseBattleParticipantsManagerProps {
  battleId: string;
  userId?: string;
  maxParticipants?: number;
  onParticipantCountChange?: (count: number) => void;
  onSpectatorCountChange?: (count: number) => void;
}

export function useBattleParticipantsManager({
  battleId,
  userId,
  maxParticipants = 2,
  onParticipantCountChange,
  onSpectatorCountChange
}: UseBattleParticipantsManagerProps) {
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [spectators, setSpectators] = useState<BattleSpectator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch battle participants and spectators
  const fetchParticipantsData = useCallback(async () => {
    if (!battleId) return;
    
    try {
      setIsLoading(true);
      
      // Get participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('battle_participants')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('battle_id', battleId);
        
      if (participantsError) throw participantsError;
      
      // Get spectators
      const { data: spectatorsData, error: spectatorsError } = await supabase
        .from('battle_spectators')
        .select('*')
        .eq('battle_id', battleId);
        
      if (spectatorsError) throw spectatorsError;
      
      // Update state with fetched data
      const typedParticipants = participantsData as BattleParticipant[] || [];
      const typedSpectators = spectatorsData as BattleSpectator[] || [];
      
      setParticipants(typedParticipants);
      setSpectators(typedSpectators);
      
      if (onParticipantCountChange) {
        onParticipantCountChange(typedParticipants.length);
      }
      
      if (onSpectatorCountChange) {
        onSpectatorCountChange(typedSpectators.length);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching battle participants data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, [battleId, onParticipantCountChange, onSpectatorCountChange]);

  // Join battle as participant or spectator
  const joinBattle = useCallback(async () => {
    if (!battleId || !userId) return;
    
    try {
      // First check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', userId)
        .single();
        
      if (existingParticipant) {
        console.log('User is already a participant');
        return; // User is already a participant
      }
      
      // Check current participant count
      const { data: currentParticipants } = await supabase
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battleId);
        
      const participantCount = currentParticipants?.length || 0;
      
      // If there's room for another participant, join as participant
      if (participantCount < maxParticipants) {
        const { error: joinError } = await supabase
          .from('battle_participants')
          .insert({
            battle_id: battleId,
            user_id: userId
          });
          
        if (joinError) throw joinError;
        
        // Show notification
        toast.success("You've joined as a participant!");
      } 
      // Otherwise join as spectator
      else {
        // Check if already a spectator
        const { data: existingSpectator } = await supabase
          .from('battle_spectators')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', userId)
          .single();
          
        if (!existingSpectator) {
          const { error: spectatorError } = await supabase
            .from('battle_spectators')
            .insert({
              battle_id: battleId,
              user_id: userId
            });
            
          if (spectatorError) throw spectatorError;
          
          toast.info("You've joined as a spectator");
        }
      }
      
      // Refresh participants data
      await fetchParticipantsData();
    } catch (err) {
      console.error('Error joining battle:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  }, [battleId, userId, maxParticipants, fetchParticipantsData]);

  // Set up subscription to participant changes
  useEffect(() => {
    if (!battleId) return;
    
    fetchParticipantsData();
    
    // Set up realtime subscriptions
    const participantsChannel = supabase
      .channel(`battle-participants-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
        () => fetchParticipantsData()
      )
      .subscribe();
      
    const spectatorsChannel = supabase
      .channel(`battle-spectators-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_spectators', filter: `battle_id=eq.${battleId}` }, 
        () => fetchParticipantsData()
      )
      .subscribe();
    
    // Use less frequent polling as a fallback
    const intervalId = setInterval(fetchParticipantsData, 30000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(spectatorsChannel);
    };
  }, [battleId, fetchParticipantsData]);

  return {
    participants,
    spectators,
    isLoading,
    error,
    joinBattle,
    fetchParticipantsData
  };
}
