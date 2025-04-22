
import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { 
  sendBattleInvitation, 
  notifyBattleStart, 
  notifyBattleEnded,
  notifyUserInteraction
} from '@/utils/notificationUtils';

export function useBattleNotifications(battleId?: string) {
  const { user } = useAuthContext();
  
  // This could be used to set up notification listeners for a battle
  useEffect(() => {
    if (!battleId || !user) return;
    
    // Set up any necessary notification listeners
    console.log('Setting up notification listeners for battle:', battleId);
    
    // Cleanup when unmounting
    return () => {
      console.log('Cleaning up notification listeners for battle:', battleId);
    };
  }, [battleId, user]);
  
  // Function to send battle invitations
  const inviteUsersToBattle = async (
    inviteeIds: string[], 
    battleTitle: string
  ) => {
    if (!user || !battleId) return false;
    
    return await sendBattleInvitation({
      inviterId: user.id,
      inviterName: user.user_metadata?.username || 'A user',
      inviteeIds,
      battleId,
      battleTitle
    });
  };
  
  // Function to notify users when a battle is starting
  const notifyBattleStarting = async (
    battleTitle: string, 
    participantIds: string[]
  ) => {
    if (!battleId) return false;
    
    return await notifyBattleStart({
      battleId,
      battleTitle,
      participantIds
    });
  };
  
  // Function to notify users when a battle has ended
  const notifyBattleHasEnded = async (
    battleTitle: string, 
    participantIds: string[], 
    winnerId?: string, 
    winnerName?: string
  ) => {
    if (!battleId) return false;
    
    return await notifyBattleEnded({
      battleId,
      battleTitle,
      participantIds,
      winnerId,
      winnerName
    });
  };
  
  // Function to notify a user when they receive a vote or comment
  const notifyInteraction = async (
    userId: string,
    actorName: string,
    actionType: 'vote' | 'comment',
    battleTitle: string
  ) => {
    if (!battleId) return false;
    
    return await notifyUserInteraction({
      userId,
      actorName,
      actionType,
      battleId,
      battleTitle
    });
  };
  
  return {
    inviteUsersToBattle,
    notifyBattleStarting,
    notifyBattleHasEnded,
    notifyInteraction
  };
}
