
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';

interface BattleSpectatorLogicProps {
  battleId: string;
  onSpectatorCountChange?: (count: number) => void;
}

const BattleSpectatorLogic = ({ battleId, onSpectatorCountChange }: BattleSpectatorLogicProps) => {
  const [spectators, setSpectators] = useState<any[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!battleId || !user) return;

    const fetchSpectators = async () => {
      try {
        const { data, error } = await supabase
          .from('battle_spectators')
          .select('*')
          .eq('battle_id', battleId);

        if (error) throw error;
        setSpectators(data || []);
        if (onSpectatorCountChange) {
          onSpectatorCountChange(data?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching spectators:', error);
      }
    };

    const joinAsSpectator = async () => {
      try {
        // Check if user is already a participant
        const { data: isParticipant, error: participantError } = await supabase
          .from('battle_participants')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();

        if (participantError && participantError.code !== 'PGRST116') {
          throw participantError;
        }

        // If user is a participant, don't add as spectator
        if (isParticipant) return;

        // Check if user is already a spectator
        const { data: existingSpectator, error: spectatorError } = await supabase
          .from('battle_spectators')
          .select('id')
          .eq('battle_id', battleId)
          .eq('user_id', user.id)
          .single();

        if (spectatorError && spectatorError.code !== 'PGRST116') {
          throw spectatorError;
        }

        // If not already a spectator, add them
        if (!existingSpectator) {
          const { error: insertError } = await supabase
            .from('battle_spectators')
            .insert([
              { battle_id: battleId, user_id: user.id }
            ]);

          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error('Error joining as spectator:', error);
      }
    };

    // Subscribe to changes in spectators
    const channel = supabase
      .channel(`battle-spectators-${battleId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_spectators',
        filter: `battle_id=eq.${battleId}` 
      }, () => {
        fetchSpectators();
      })
      .subscribe();

    // Fetch initial spectators and join as spectator
    fetchSpectators();
    joinAsSpectator();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId, user, onSpectatorCountChange]);

  return null; // This is a logic component, it doesn't render anything
};

export default BattleSpectatorLogic;
