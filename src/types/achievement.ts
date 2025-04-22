
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'battle' | 'performance' | 'community';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
  battleId?: string;
}
