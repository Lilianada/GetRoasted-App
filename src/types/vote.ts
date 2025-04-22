
// src/types/vote.ts

export interface Vote {
  id: string;
  battle_id: string;
  voter_id: string;
  voted_for_user_id: string;
  score: number;
}
