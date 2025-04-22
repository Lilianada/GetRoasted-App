
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
  status: 'waiting' | 'active' | 'completed';
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
