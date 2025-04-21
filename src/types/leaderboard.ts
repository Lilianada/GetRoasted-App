// src/types/leaderboard.ts

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url?: string;
  battles: number;
  wins: number;
  win_rate: number;
  average_score: number;
}
