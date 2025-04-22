import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { playNotificationSound } from '@/utils/notificationSound';

interface BattlePresenceManagerProps {
  battleId: string;
  onParticipantCountChange?: (count: number) => void;
  onSpectatorCountChange?: (count: number) => void;
  onBattleStateChange?: (state: 'waiting' | 'ready' | 'active' | 'completed') => void;
  onGetReadyModal?: () => void;
  maxParticipants?: number;
}

const BattlePresenceManager = ({
  battleId,
  onParticipantCountChange,
  onSpectatorCountChange,
  onBattleStateChange,
  onGetReadyModal,
  maxParticipants = 2
}: BattlePresenceManagerProps) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [spectators, setSpectators] = useState<any[]>([]);
  const [battleState, setBattleState] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const { user } = useAuthContext();

  useEffect(() => {
    if (!battleId || !user) return;

    // Function to fetch battle data
    const fetchBattleData = async () => {
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
          .select('*')
          .eq('battle_id', battleId);
          
        if (participantsError) throw participantsError;
        
        // Get spectators
        const { data: spectatorsData, error: spectatorsError } = await supabase
          .from('battle_spectators')
          .select('*')
          .eq('battle_id', battleId);
          
        if (spectatorsError) throw spectatorsError;
        
        setParticipants(participantsData || []);
        setSpectators(spectatorsData || []);
        
        if (onParticipantCountChange) {
          onParticipantCountChange(participantsData?.length || 0);
        }
        
        if (onSpectatorCountChange) {
          onSpectatorCountChange(spectatorsData?.length || 0);
        }
        
        // Determine battle state
        const participantCount = participantsData?.length || 0;
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
          if (battleState !== 'ready' && onGetReadyModal) {
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
        
        setBattleState(newState);
        
        if (onBattleStateChange && newState !== battleState) {
          onBattleStateChange(newState);
        }
      } catch (error) {
        console.error('Error fetching battle presence data:', error);
      }
    };

    // Function to join as participant or spectator
    const joinBattle = async () => {
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
          
          // If this is the second participant, play notification sound
          if (participantCount === maxParticipants - 1) {
            playNotificationSound();
          }
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
          }
        }
        
        // Refresh battle data
        fetchBattleData();
      } catch (error) {
        console.error('Error joining battle:', error);
      }
    };

    // Initial data fetch and join logic
    fetchBattleData();
    joinBattle();
    
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
    
    // Periodic refresh as a fallback
    const intervalId = setInterval(fetchBattleData, 10000);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(spectatorsChannel);
      supabase.removeChannel(battlesChannel);
    };
  }, [battleId, user, maxParticipants, battleState, onParticipantCountChange, onSpectatorCountChange, onBattleStateChange, onGetReadyModal]);

  // Handle user presence/disconnection
  useEffect(() => {
    if (!battleId || !user) return;
    
    // Create a function to ping the server periodically to indicate presence
    const pingPresence = async () => {
      try {
        // This is a simple approach - update user's last seen timestamp
        // For a more robust solution, consider using Supabase Realtime Presence
        const now = new Date().toISOString();
        
        // Check if user is a participant
        const { data: participantData } = await supabase
          .from('battle_participants')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();
          
        if (participantData) {
          // Update participant last seen time (this would require adding a last_seen column)
          // We'll implement this in a future update
          console.log('User is a participant, pinged presence');
        } else {
          // Check if user is a spectator
          const { data: spectatorData } = await supabase
            .from('battle_spectators')
            .select('id')
            .eq('battle_id', battleId)
            .eq('user_id', user.id)
            .single();
            
          if (spectatorData) {
            console.log('User is a spectator, pinged presence');
          }
        }
      } catch (error) {
        console.error('Error pinging presence:', error);
      }
    };
    
    // Ping presence immediately and then every 30 seconds
    pingPresence();
    const pingInterval = setInterval(pingPresence, 30000);
    
    // Setup beforeunload event to handle disconnects
    const handleBeforeUnload = () => {
      // This is a synchronous operation that runs when the user leaves
      // We could mark the user as disconnected, but for simplicity,
      // we'll rely on our ping mechanism to detect absence
      console.log('User is leaving the battle');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(pingInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [battleId, user]);

  // This component doesn't render anything
  return null;
};

export default BattlePresenceManager;
