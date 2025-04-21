// src/types/user.ts

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  subscription_tier?: 'free' | 'pro';
}
