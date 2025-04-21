// src/types/notification.ts

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'battle_invite' | 'battle_start' | 'battle_end' | 'leaderboard' | 'account' | 'other';
}
