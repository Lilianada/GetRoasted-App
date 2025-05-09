
import React, { ReactNode } from "react";
import { BattleStateProvider } from './BattleStateContext';
import { BattleParticipationProvider } from './BattleParticipationContext';
import { BattleTimerProvider } from './BattleTimerContext';
import { BattleRoundProvider } from './BattleRoundContext';
import { BattleVotingProvider } from './BattleVotingContext';
import { BattleActionsProvider } from './BattleActionsContext';
import { supabase } from '@/integrations/supabase/client';
import { useVoteMutation } from '@/hooks/battle/useBattleData';
import { toast } from '@/components/ui/sonner';

interface BattleProvidersProps {
  children: ReactNode;
  battleId: string | undefined;
  userId?: string | undefined;
  battle: any;
}

export const BattleProviders = ({
  children,
  battleId,
  userId,
  battle
}: BattleProvidersProps) => {
  return (
    <BattleStateProvider>
      <BattleParticipationProvider userId={userId}>
        <BattleTimerProvider 
          initialTimePerTurn={battle?.time_per_turn || 180}
          syncTimer={(time) => {
            if (battleId) {
              const channel = supabase.channel(`battle-timer-${battleId}`);
              channel.send({
                type: 'broadcast',
                event: 'timer-update',
                payload: { timeRemaining: time }
              });
            }
          }}
        >
          <BattleRoundProvider 
            initialTotalRounds={battle?.round_count || 3}
          >
            <BattleVotingProvider
              onVote={(votedForId) => {
                if (!userId || !battleId) {
                  toast.error("You need to be logged in to vote");
                  return Promise.resolve();
                }
                
                const voteMutation = useVoteMutation();
                return voteMutation.mutateAsync({ 
                  battleId, 
                  voterId: userId, 
                  votedForId, 
                  score: 10 // Simple scoring system: 10 points per vote
                });
              }}
            >
              <BattleActionsProvider
                battleId={battleId}
                userId={userId}
                battle={battle}
                currentRound={1}
              >
                {children}
              </BattleActionsProvider>
            </BattleVotingProvider>
          </BattleRoundProvider>
        </BattleTimerProvider>
      </BattleParticipationProvider>
    </BattleStateProvider>
  );
};
