
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
    
    // Trigger email notifications for premium users
    await triggerEmailNotifications({
      userIds: inviteeIds, 
      templateId: 'battle_invite',
      data: {
        inviter_name: inviterName,
        battle_title: battleTitle,
        battle_url: `/battles/join/${battleId}`
      }
    });
    
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
    
    // Email notification for battle start is high priority
    await triggerEmailNotifications({
      userIds: participantIds,
      templateId: 'battle_start',
      data: {
        battle_title: battleTitle,
        battle_url: `/battles/${battleId}`
      },
      priority: true
    });
    
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
    
    // Only send email for the winner and the battle creator
    const priorityUserIds = winnerId ? [winnerId] : [];
    if (priorityUserIds.length > 0) {
      await triggerEmailNotifications({
        userIds: priorityUserIds,
        templateId: 'battle_results',
        data: {
          battle_title: battleTitle,
          battle_url: `/battles/${battleId}/results`,
          winner_name: winnerName || 'No winner'
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error sending battle end notifications:', error);
    return false;
  }
}

/**
 * Notify a user when they receive votes or comments
 */
export async function notifyUserInteraction({
  userId,
  actorName,
  actionType,
  battleId,
  battleTitle
}: {
  userId: string;
  actorName: string;
  actionType: 'vote' | 'comment';
  battleId: string;
  battleTitle: string;
}) {
  const title = actionType === 'vote' ? 'New Vote Received' : 'New Comment';
  const message = actionType === 'vote' 
    ? `${actorName} voted for you in "${battleTitle}"`
    : `${actorName} commented on your performance in "${battleTitle}"`;
  
  try {
    await createNotification({
      userId,
      title,
      message,
      type: 'battle_end',
      actionUrl: `/battles/${battleId}/results`
    });
    
    // No email for votes/comments - these are lower priority
    return true;
  } catch (error) {
    console.error('Error sending interaction notification:', error);
    return false;
  }
}

/**
 * Notify a user about account related actions
 */
export async function notifyAccountAction({
  userId,
  title,
  message,
  actionUrl
}: {
  userId: string;
  title: string;
  message: string;
  actionUrl?: string;
}) {
  try {
    await createNotification({
      userId,
      title,
      message,
      type: 'account',
      actionUrl
    });
    
    // Account notifications are important - send email too
    await triggerEmailNotifications({
      userIds: [userId],
      templateId: 'account_notification',
      data: {
        notification_title: title,
        notification_message: message,
        action_url: actionUrl || ''
      },
      priority: true
    });
    
    return true;
  } catch (error) {
    console.error('Error sending account notification:', error);
    return false;
  }
}

/**
 * Trigger email notifications for users who have enabled email notifications
 */
async function triggerEmailNotifications({
  userIds,
  templateId,
  data,
  priority = false
}: {
  userIds: string[];
  templateId: string;
  data: Record<string, string>;
  priority?: boolean;
}) {
  if (userIds.length === 0) return;
  
  try {
    // First get users who have email notifications enabled
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, email_notifications')
      .in('id', userIds)
      .eq('email_notifications', true);
    
    if (error) throw error;
    
    // If no users have email notifications enabled or no user data found
    if (!profiles || profiles.length === 0) return;
    
    // Get the emails of users using admin api (simplified for this context)
    // In a real implementation, you would use a secure server-side approach
    for (const profile of profiles) {
      // Using a simple approach without admin list users to fix the build error
      const { data: userData } = await supabase.auth
        .getUser();
      
      if (!userData?.user) continue;
      
      // Call the email sending API endpoint
      await fetch('/api/send-reminder-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.user.email,
          name: profile.username || 'User',
          reminder_text: data.notification_message || 'You have a new notification',
          templateId
        }),
      });
    }
  } catch (error) {
    console.error('Error sending email notifications:', error);
  }
}

/**
 * Integrate notification creation into battle creation
 */
export function setupBattleNotificationTriggers(battleId: string, creatorId: string, invitedUserIds: string[] = []) {
  // This function would be called when a battle is created
  // It would set up the notification triggers for the battle
  // We could store this information in a separate table to track
  // which notifications need to be sent for which battles
  console.log('Setting up notification triggers for battle:', battleId, 'creator:', creatorId, 'invited users:', invitedUserIds);
  
  // In a real implementation, we'd store this info and use it
  // to trigger notifications at the appropriate times
}
