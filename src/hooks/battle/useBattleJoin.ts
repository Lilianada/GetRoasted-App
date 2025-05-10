
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuthContext } from '@/context/AuthContext';

interface UseBattleJoinProps {
  battleId?: string;
  userId?: string; // Add userId property to the interface
  maxParticipants?: number;
  onParticipantCountChange?: (count: number) => void;
  onSpectatorCountChange?: (count: number) => void;
}

export function useBattleJoin({
  battleId,
  userId,
  maxParticipants = 2,
  onParticipantCountChange,
  onSpectatorCountChange
}: UseBattleJoinProps) {
  const { user } = useAuthContext();
  const [participants, setParticipants] = useState<any[]>([]);
  const [spectators, setSpectators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  
  // Use userId from props if provided, otherwise use from auth context
  const effectiveUserId = userId || user?.id;

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
        
      if (participantsError) {
        console.error('Error fetching battle participants:', participantsError);
        setError(new Error(`Failed to fetch participants: ${participantsError.message}`));
        setIsLoading(false);
        return;
      }
      
      // Get spectators
      const { data: spectatorsData, error: spectatorsError } = await supabase
        .from('battle_spectators')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('battle_id', battleId);
        
      if (spectatorsError) {
        console.error('Error fetching battle spectators:', spectatorsError);
        // Continue even if spectators fetch fails
      }
      
      // Update state with fetched data
      const typedParticipants = participantsData as any[] || [];
      setParticipants(typedParticipants);
      
      const typedSpectators = spectatorsData as any[] || [];
      setSpectators(typedSpectators);
      
      if (onParticipantCountChange) {
        onParticipantCountChange(typedParticipants.length);
      }
      
      if (onSpectatorCountChange) {
        onSpectatorCountChange(typedSpectators.length);
      }
      
      // Check if current user is already a participant
      if (effectiveUserId && typedParticipants.some(p => p.user_id === effectiveUserId)) {
        setHasJoined(true);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error in fetchParticipants:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching participants'));
      setIsLoading(false);
    }
  }, [battleId, onParticipantCountChange, onSpectatorCountChange, effectiveUserId]);

  // Join battle function
  const joinBattle = useCallback(async (asSpectator: boolean = false) => {
    if (!battleId || !effectiveUserId) {
      toast.error("You must be logged in to join a battle");
      return false;
    }
    
    if (hasJoined) return true;
    
    try {
      // First check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', effectiveUserId)
        .single();
        
      if (existingParticipant) {
        // User is already a participant
        setHasJoined(true);
        return true;
      }
      
      // Check if user already joined as spectator
      const { data: existingSpectator } = await supabase
        .from('battle_spectators')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', effectiveUserId)
        .single();
        
      if (existingSpectator && asSpectator) {
        return true;
      }
      
      if (asSpectator) {
        // Join as spectator
        const { error: joinSpectatorError } = await supabase
          .from('battle_spectators')
          .insert({
            battle_id: battleId,
            user_id: effectiveUserId
          });
          
        if (joinSpectatorError) throw joinSpectatorError;
        
        toast.success("You've joined as a spectator!");
        return true;
      } else {
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
              user_id: effectiveUserId
            });
            
          if (joinError) throw joinError;
          
          toast.success("You've joined the battle!");
          setHasJoined(true);
          return true;
        } else {
          // If battle is full, join as spectator
          const { error: joinSpectatorError } = await supabase
            .from('battle_spectators')
            .insert({
              battle_id: battleId,
              user_id: effectiveUserId
            });
            
          if (joinSpectatorError) throw joinSpectatorError;
          
          toast.info("Battle is full! You've joined as a spectator.");
          return true;
        }
      }
    } catch (err) {
      console.error('Error joining battle:', err);
      toast.error("Failed to join the battle");
      return false;
    }
  }, [battleId, effectiveUserId, maxParticipants, hasJoined]);

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
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to participants channel:', status);
        }
      });
    
    const spectatorsChannel = supabase
      .channel(`battle-spectators-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_spectators', filter: `battle_id=eq.${battleId}` }, 
        () => fetchParticipants()
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to spectators channel:', status);
        }
      });
    
    // Auto-join as participant or spectator if not joined yet
    if (effectiveUserId && !hasJoined) {
      joinBattle(false).catch(err => {
        console.error('Failed to auto-join battle:', err);
      });
    }
    
    // Cleanup function
    return () => {
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(spectatorsChannel);
    };
  }, [battleId, fetchParticipants, hasJoined, joinBattle, effectiveUserId]);

  return {
    participants,
    spectators,
    isLoading,
    error,
    joinBattle,
    fetchParticipants
  };
}
