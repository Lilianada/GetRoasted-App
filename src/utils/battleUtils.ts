import type { Battle, Participant, Vote } from '@/types/battle';

export function getBattleStatusLabel(status: Battle['status']): string {
  switch (status) {
    case 'waiting':
      return 'Waiting for players';
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
}

export function mapParticipant(p: any): Participant {
  return {
    id: p.user_id,
    username: p.profiles?.username || 'Unknown',
    avatar_url: p.profiles?.avatar_url || undefined,
  };
}
