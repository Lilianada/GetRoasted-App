
import { useCallback, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useBattleParticipantsManager } from '@/hooks/useBattleParticipantsManager';
import { useBattleStateManager } from '@/hooks/useBattleStateManager';
import { useBattlePresence } from '@/hooks/useBattlePresence';

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
  const { user } = useAuthContext();
  
  // Use the participants manager hook
  const { 
    participants, 
    error: participantsError,
    joinBattle 
  } = useBattleParticipantsManager({
    battleId,
    userId: user?.id,
    maxParticipants,
    onParticipantCountChange,
    onSpectatorCountChange
  });

  // Use the battle state manager hook
  const { 
    error: stateError 
  } = useBattleStateManager({
    battleId,
    participants,
    maxParticipants,
    onBattleStateChange,
    onGetReadyModal
  });

  // Use the presence hook
  useBattlePresence({
    battleId,
    userId: user?.id
  });

  // Handle any errors from the hooks
  useEffect(() => {
    if (participantsError && onError) {
      onError(participantsError);
    }
    
    if (stateError && onError) {
      onError(stateError);
    }
  }, [participantsError, stateError, onError]);

  // Effect to handle initial join
  useEffect(() => {
    if (battleId && user) {
      joinBattle();
    }
  }, [battleId, user, joinBattle]);

  // This component doesn't render anything
  return null;
};

export default BattlePresenceManager;
