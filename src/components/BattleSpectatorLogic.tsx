import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";

/**
 * Tracks and updates the spectator count for a battle. Increments on mount, decrements on unmount.
 * Returns the current spectator count (subscribed to in real-time).
 */
export function useSpectatorCount(battleId: string, isParticipant: boolean) {
  const { checkCanSpectateBattle } = useSubscriptionLimits();
  const [spectatorCount, setSpectatorCount] = React.useState(0);

  useEffect(() => {
    if (!battleId || isParticipant) return;

    // Check if user can spectate before adding them
    if (!checkCanSpectateBattle()) {
      return;
    }

    // Add this user as a spectator (optional: only if not already present)
    const userId = supabase.auth.user()?.id;
    if (userId) {
      supabase.from('battle_spectators').upsert({ battle_id: battleId, user_id: userId });
    }
    // Subscribe to real-time spectator count
    const subscription = supabase
      .from(`battle_spectators:battle_id=eq.${battleId}`)
      .on('*', payload => {
        // Re-fetch count on any change
        supabase.from('battle_spectators').select('*', { count: 'exact', head: true })
          .eq('battle_id', battleId)
          .then(({ count }) => setSpectatorCount(count || 0));
      })
      .subscribe();
    // Initial fetch
    supabase.from('battle_spectators').select('*', { count: 'exact', head: true })
      .eq('battle_id', battleId)
      .then(({ count }) => setSpectatorCount(count || 0));
    // Cleanup: remove spectator on leave
    return () => {
      if (userId) {
        supabase.from('battle_spectators').delete().eq('battle_id', battleId).eq('user_id', userId);
      }
      supabase.removeSubscription(subscription);
    };
  }, [battleId, isParticipant, checkCanSpectateBattle]);
  return spectatorCount;
}
