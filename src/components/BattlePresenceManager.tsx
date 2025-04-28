import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { BattleParticipant, BattleSpectator } from '@/types/battle';
import { playSound } from '@/utils/notificationSound';
import { toast } from '@/components/ui/sonner';

interface BattlePresenceManagerProps {
  battleId: string;
  onParticipantCountChange?: (count: number) => void;
  onSpectatorCountChange?: (count: number) => void;
  onBattleStateChange?: (state: 'waiting' | 'ready' | 'active' | 'completed') => void;
  onGetReadyModal?: () => void;
  onError?: (error: Error) => void;
  maxParticipants?: number;
}

/**
 * BattlePresenceManager - Manages user presence and state for a battle
 * 
 * This component doesn't render anything but handles:
 * - Tracking participants and spectators
 * - Managing battle state transitions
 * - Handling user join/leave events
 * - Maintaining presence with periodic pings
 */
const BattlePresenceManager = ({
  battleId,
  onParticipantCountChange,
  onSpectatorCountChange,
  onBattleStateChange,
  onGetReadyModal,
  onError,
  maxParticipants = 2
}: BattlePresenceManagerProps) => {
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [spectators, setSpectators] = useState<BattleSpectator[]>([]);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const { user } = useAuthContext();
  
  // Use refs to avoid dependency issues in useEffect
  const battleStateRef = useRef(battleState);
  const participantsRef = useRef(participants);
  
  // Update refs when state changes
  useEffect(() => {
    battleStateRef.current = battleState;
    participantsRef.current = participants;
  }, [battleState, participants]);

  // Fetch battle data function
  const fetchBattleData = useCallback(async () => {
    if (!battleId || !user) return;
    
    try {
      // Get battle status
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .select('status')
        .eq('id', battleId)
        .single();
        
      if (battleError) throw battleError;
      
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
      
      // Determine battle state
      const participantCount = typedParticipants.length;
      let newState: 'waiting' | 'ready' | 'active' | 'completed';
      
      if (battleData?.status === 'completed') {
        newState = 'completed';
      } else if (battleData?.status === 'active') {
        newState = 'active';
      } else if (participantCount < maxParticipants) {
        newState = 'waiting';
      } else {
        newState = 'ready';
        
        // If we've just reached the "ready" state, trigger the Get Ready modal
        if (battleStateRef.current !== 'ready' && onGetReadyModal) {
          onGetReadyModal();
        }
        
        // If the state is ready but the battle status isn't active yet,
        // update the battle status to active
        if (battleData?.status !== 'active') {
          await supabase
            .from('battles')
            .update({ status: 'active' })
            .eq('id', battleId);
        }
      }
      
      if (newState !== battleStateRef.current) {
        setBattleState(newState);
        
        if (onBattleStateChange) {
          onBattleStateChange(newState);
        }
      }
    } catch (error) {
      console.error('Error fetching battle presence data:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [battleId, user, maxParticipants, onParticipantCountChange, onSpectatorCountChange, onBattleStateChange, onGetReadyModal, onError]);

  // Join battle function
  const joinBattle = useCallback(async () => {
    if (!battleId || !user) return;
    
    try {
      // First check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('battle_participants')
        .select('id')
        .eq('battle_id', battleId)
        .eq('user_id', user.id)
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
            user_id: user.id
          });
          
        if (joinError) throw joinError;
        
        // Play sound and show notification
        playSound();
        toast.success("You've joined as a participant!");
      } 
      // Otherwise join as spectator
      else {
        // Check if already a spectator
        const { data: existingSpectator } = await supabase
          .from('battle_spectators')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (!existingSpectator) {
          const { error: spectatorError } = await supabase
            .from('battle_spectators')
            .insert({
              battle_id: battleId,
              user_id: user.id
            });
            
          if (spectatorError) throw spectatorError;
          
          toast.info("You've joined as a spectator");
        }
      }
      
      // Refresh battle data
      await fetchBattleData();
    } catch (error) {
      console.error('Error joining battle:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [battleId, user, maxParticipants, fetchBattleData, onError]);

  // Set up main effect for battle data and presence
  useEffect(() => {
    if (!battleId || !user) return;
    
    // Initial data fetch and join logic
    (async () => {
      await fetchBattleData();
      await joinBattle();
    })();
    
    // Set up realtime subscriptions
    const participantsChannel = supabase
      .channel(`battle-participants-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_participants', filter: `battle_id=eq.${battleId}` }, 
        () => fetchBattleData()
      )
      .subscribe();
      
    const spectatorsChannel = supabase
      .channel(`battle-spectators-${battleId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battle_spectators', filter: `battle_id=eq.${battleId}` }, 
        () => fetchBattleData()
      )
      .subscribe();
      
    const battlesChannel = supabase
      .channel(`battles-${battleId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` }, 
        () => fetchBattleData()
      )
      .subscribe();
    
    // Use less frequent polling as a fallback
    const intervalId = setInterval(fetchBattleData, 30000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(spectatorsChannel);
      supabase.removeChannel(battlesChannel);
    };
  }, [battleId, user, fetchBattleData, joinBattle]);

  // Handle user presence/disconnection
  useEffect(() => {
    if (!battleId || !user) return;
    
    // Create a function to ping the server periodically to indicate presence
    const pingPresence = async () => {
      try {
        const now = new Date().toISOString();
        
        // Update presence data in a dedicated table
        const { data, error } = await supabase
          .from('battle_presence')
          .upsert(
            { 
              battle_id: battleId, 
              user_id: user.id, 
              last_seen: now,
              is_online: true
            },
            { onConflict: 'battle_id,user_id' }
          );
          
        if (error) {
          console.error('Error updating presence:', error);
        }
      } catch (error) {
        console.error('Error pinging presence:', error);
      }
    };
    
    // Ping presence immediately and then every 30 seconds
    pingPresence();
    const pingInterval = setInterval(pingPresence, 30000);
    
    // Setup beforeunload event to handle disconnects
    const handleBeforeUnload = async () => {
      try {
        // Mark user as offline on page unload
        await supabase
          .from('battle_presence')
          .upsert(
            { 
              battle_id: battleId, 
              user_id: user.id, 
              last_seen: new Date().toISOString(),
              is_online: false
            },
            { onConflict: 'battle_id,user_id' }
          );
      } catch (error) {
        // Cannot log here effectively as the page is unloading
        console.error('Error updating offline status:', error);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(pingInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Mark user as offline when component unmounts
      (async () => {
        try {
          await supabase
            .from('battle_presence')
            .upsert(
              { 
                battle_id: battleId, 
                user_id: user.id, 
                last_seen: new Date().toISOString(),
                is_online: false
              },
              { onConflict: 'battle_id,user_id' }
            );
        } catch (error) {
          console.error('Error updating offline status on unmount:', error);
        }
      })();
    };
  }, [battleId, user]);

  // This component doesn't render anything
  return null;
};

export default BattlePresenceManager;
