// src/types/battle.ts

export interface Participant {
  id: string;
  username: string;
  avatar_url?: string;
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
}

export interface Vote {
  id: string;
  battle_id: string;
  voter_id: string;
  voted_for_id: string;
  score: number;
}
