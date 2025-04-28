
// src/types/battle.ts

export interface Participant {
  id: string;
  username: string;
  avatar_url?: string;
  score?: number;
  user_id?: string;
}

export interface Battle {
  id: string;
  title: string;
  status: 'waiting' | 'ready' | 'active' | 'completed';
  roundCount: number;
  type: 'public' | 'private';
  participants: Participant[];
  spectatorCount: number;
  timeRemaining?: number;
  round_count?: number;
  time_per_turn?: number;
}

export interface Vote {
  id: string;
  battle_id: string;
  voter_id: string;
  voted_for_id: string;
  voted_for_user_id: string;
  score: number;
}

export interface RoastData {
  id: string;
  content: string;
  user_id: string;
  battle_id: string;
  round_number: number;
  created_at: string;
  is_voice?: boolean;
  voice_url?: string;
}

export interface BattleParticipant {
  id: string;
  user_id: string;
  battle_id: string;
  joined_at: string;
  username?: string;
  avatar_url?: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

export interface BattleSpectator {
  id: string;
  battle_id: string;
  user_id: string;
  joined_at: string;
}

export interface BattlePresence {
  user_id: string;
  last_seen: string;
  is_online: boolean;
}

export interface BattleReaction {
  id: string;
  battle_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
  roast_id?: string;
}
