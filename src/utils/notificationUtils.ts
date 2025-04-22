
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

/**
 * Creates a new notification for a user
 */
export async function createNotification({
  userId,
  title,
  message,
  type,
  actionUrl
}: {
  userId: string;
  title: string;
  message: string;
  type: Notification['type'];
  actionUrl?: string;
}) {
  try {
    const { error } = await supabase.from('notifications').insert([{
      user_id: userId,
      title,
      message,
      type,
      action_url: actionUrl
    }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
}

/**
 * Creates battle invitation notifications
 */
export async function sendBattleInvitation({
  inviterId,
  inviterName,
  inviteeIds,
  battleId,
  battleTitle
}: {
  inviterId: string;
  inviterName: string;
  inviteeIds: string[];
  battleId: string;
  battleTitle: string;
}) {
  const notifications = inviteeIds.map(userId => ({
    user_id: userId,
    title: 'Battle Invitation',
    message: `${inviterName} has invited you to join "${battleTitle}"`,
    type: 'battle_invite' as Notification['type'],
    action_url: `/battles/join/${battleId}`
  }));

  try {
    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending battle invitations:', error);
    return false;
  }
}

/**
 * Notifies users when a battle is about to start
 */
export async function notifyBattleStart({
  battleId,
  battleTitle,
  participantIds
}: {
  battleId: string;
  battleTitle: string;
  participantIds: string[];
}) {
  const notifications = participantIds.map(userId => ({
    user_id: userId,
    title: 'Battle Starting',
    message: `Your battle "${battleTitle}" is about to begin!`,
    type: 'battle_start' as Notification['type'],
    action_url: `/battles/${battleId}`
  }));

  try {
    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending battle start notifications:', error);
    return false;
  }
}

/**
 * Notifies users when a battle has ended
 */
export async function notifyBattleEnded({
  battleId,
  battleTitle,
  participantIds,
  winnerId,
  winnerName
}: {
  battleId: string;
  battleTitle: string;
  participantIds: string[];
  winnerId?: string;
  winnerName?: string;
}) {
  const baseMessage = `The battle "${battleTitle}" has ended.`;
  const winnerMessage = winnerId ? ` ${winnerName} is the winner!` : '';
  
  const notifications = participantIds.map(userId => ({
    user_id: userId,
    title: 'Battle Ended',
    message: `${baseMessage}${winnerMessage}`,
    type: 'battle_end' as Notification['type'],
    action_url: `/battles/${battleId}/results`
  }));

  try {
    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending battle end notifications:', error);
    return false;
  }
}
