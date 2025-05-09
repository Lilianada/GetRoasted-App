
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BattleParticipant } from '@/types/battle';
import { toast } from '@/components/ui/sonner';

interface UseBattleParticipantsProps {
  battleId: string;
  userId?: string;
  maxParticipants?: number;
  onParticipantCountChange?: (count: number) => void;
}

/**
 * Hook to manage battle participants
 */
export function useBattleParticipants({
  battleId,
  userId,
  maxParticipants = 2,
  onParticipantCountChange
}: UseBattleParticipantsProps) {
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  // Fetch battle participants
  const fetchParticipants = useCallback(async () => {
    if (!battleId) return;
    
    try {
      setIsLoading(true);
      
      // Get participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('battle_participants')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('battle_id', battleId);
        
      if (participantsError) throw participantsError;
      
      // Update state with fetched data
      const typedParticipants = participantsData as BattleParticipant[] || [];
      setParticipants(typedParticipants);
      
      if (onParticipantCountChange) {
        onParticipantCountChange(typedParticipants.length);
      }
      
      // Check if current user is already a participant
      if (userId && typedParticipants.some(p => p.user_id === userId)) {
        setHasJoined(true);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching battle participants data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, [battleId, onParticipantCountChange, userId]);

  // Join battle as participant
  const joinAsBattleParticipant = useCallback(async () => {
    if (!battleId || !userId || hasJoined) return false;
    
    try {
      // First check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', userId)
        .single();
        
      if (existingParticipant) {
        // User is already a participant
        console.log('User is already a participant');
        setHasJoined(true);
        return true;
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
        setHasJoined(true);
        return true;
      }
      
      // No room for participant
      return false;
    } catch (err) {
      console.error('Error joining as battle participant:', err);
      return false;
    }
  }, [battleId, userId, maxParticipants, hasJoined]);

  // Set up subscription to participant changes
  useEffect(() => {
    if (!battleId) return;
    
    fetchParticipants();
    
    // Set up realtime subscriptions
    const participantsChannel = supabase
      .channel(`battle-participants-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
        () => fetchParticipants()
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [battleId, fetchParticipants]);

  return {
    participants,
    isLoading,
    error,
    hasJoined,
    fetchParticipants,
    joinAsBattleParticipant,
    setHasJoined
  };
}
