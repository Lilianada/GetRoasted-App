
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UseBattlePresenceProps {
  battleId: string;
  userId?: string;
}

/**
 * Hook to manage user presence in a battle
 */
export function useBattlePresence({ 
  battleId, 
  userId 
}: UseBattlePresenceProps) {
  const channelRef = useRef<any>(null);
  
  // Handle tracking user presence
  const trackPresence = useCallback(async () => {
    if (!battleId || !userId) return;
    
    // Create a channel for user presence
    const channel = supabase.channel(`presence-${battleId}`);
    channelRef.current = channel;
    
    await channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Current presence state:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        
        // Only track presence once after subscription
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          is_participant: true
        });
      });
    
    // Setup beforeunload event to handle disconnects
    const handleBeforeUnload = () => {
      console.log('User leaving battle page');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      console.log('Component unmounting, user leaving battle');
    };
  }, [battleId, userId]);

  // Set up presence tracking when component mounts - only once
  useEffect(() => {
    if (!battleId || !userId) return;
    
    const cleanup = trackPresence();
    return () => {
      if (cleanup) cleanup.then(fn => fn && fn());
    };
  }, [battleId, userId, trackPresence]);
}
