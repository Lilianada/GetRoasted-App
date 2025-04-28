
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { Achievement } from '@/types/achievement';
import { toast } from '@/components/ui/sonner';

// Define achievement categories
export const ACHIEVEMENT_CATEGORIES = {
  BATTLE: 'battle',
  PERFORMANCE: 'performance',
  COMMUNITY: 'community',
} as const;

// Define achievement rarities
export const ACHIEVEMENT_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
} as const;

// Define all achievements
export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_BATTLE: {
    id: 'first_battle',
    name: 'Battle Rookie',
    description: 'Participated in your first roast battle',
    icon: '🔰',
    category: 'battle',
    rarity: 'common',
  },
  FIRST_WIN: {
    id: 'first_win',
    name: 'Victory Lap',
    description: 'Won your first roast battle',
    icon: '🏆',
    category: 'battle',
    rarity: 'common',
  },
  FIVE_BATTLES: {
    id: 'five_battles',
    name: 'Battle Veteran',
    description: 'Participated in 5 roast battles',
    icon: '⚔️',
    category: 'battle',
    rarity: 'uncommon',
  },
  HIGH_SCORE: {
    id: 'high_score',
    name: 'Crowd Pleaser',
    description: 'Received a score of 50+ in a single battle',
    icon: '🌟',
    category: 'performance',
    rarity: 'rare',
  },
  COMEBACK_KING: {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Won a battle after being behind in points',
    icon: '👑',
    category: 'performance',
    rarity: 'epic',
  },
  WINNING_STREAK: {
    id: 'winning_streak',
    name: 'Hot Streak',
    description: 'Won 3 battles in a row',
    icon: '🔥',
    category: 'performance',
    rarity: 'rare',
  },
  POPULAR_ROASTER: {
    id: 'popular_roaster',
    name: 'Popular Roaster',
    description: 'Received 10+ spectator reactions',
    icon: '👋',
    category: 'community',
    rarity: 'uncommon',
  },
  LEGENDARY_STATUS: {
    id: 'legendary_status',
    name: 'Legendary Status',
    description: 'Ranked in the top 10 on the leaderboard',
    icon: '⭐',
    category: 'community',
    rarity: 'legendary',
  },
};

// Hook for handling user achievements
export function useAchievements() {
  const [userAchievements, setUserAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const { user } = useAuthContext();

  // Fetch user achievements
  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setUserAchievements([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setUserAchievements(data?.map(item => item.achievement_id) || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if user has achievement
  const hasAchievement = useCallback((achievementId: string) => {
    return userAchievements.includes(achievementId);
  }, [userAchievements]);

  // Award achievement to user
  const awardAchievement = useCallback(async (
    achievementId: string,
    battleId?: string
  ) => {
    if (!user || !ACHIEVEMENTS[achievementId] || hasAchievement(achievementId)) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          battle_id: battleId,
        });

      if (error) throw error;

      // Update local state
      setUserAchievements(prev => [...prev, achievementId]);
      setNewAchievement(ACHIEVEMENTS[achievementId]);

      // Show notification
      toast.success(`Achievement Unlocked: ${ACHIEVEMENTS[achievementId].name}`);

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'achievement',
          title: 'Achievement Unlocked',
          message: `You earned the "${ACHIEVEMENTS[achievementId].name}" achievement!`,
        });

      return true;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return false;
    }
  }, [user, hasAchievement]);

  // Check for battle-related achievements
  const checkBattleAchievements = useCallback(async (battleId: string, isWinner: boolean) => {
    if (!user) return;

    try {
      // Count user's battles
      const { data: battleCount, error: countError } = await supabase
        .from('battle_participants')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (countError) throw countError;

      // First battle achievement
      if (battleCount?.length === 1) {
        await awardAchievement('FIRST_BATTLE', battleId);
      }

      // Five battles achievement
      if (battleCount?.length === 5) {
        await awardAchievement('FIVE_BATTLES', battleId);
      }

      // First win achievement
      if (isWinner) {
        if (!hasAchievement('FIRST_WIN')) {
          await awardAchievement('FIRST_WIN', battleId);
        }

        // Check for winning streak
        const { data: recentBattles, error: recentError } = await supabase
          .from('battles')
          .select(`
            id,
            battle_votes(voted_for_user_id, score)
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(4);

        if (recentError) throw recentError;

        // Count consecutive wins
        let winStreak = 0;
        if (recentBattles) {
          for (const battle of recentBattles) {
            const votes = battle.battle_votes;
            if (!votes || votes.length === 0) continue;

            // Group votes by user
            const votesByUser: Record<string, number> = {};
            for (const vote of votes) {
              if (!votesByUser[vote.voted_for_user_id]) {
                votesByUser[vote.voted_for_user_id] = 0;
              }
              votesByUser[vote.voted_for_user_id] += vote.score;
            }

            // Find winner
            let highestScore = 0;
            let winnerId = null;
            for (const [userId, score] of Object.entries(votesByUser)) {
              if (score > highestScore) {
                highestScore = score;
                winnerId = userId;
              }
            }

            if (winnerId === user.id) {
              winStreak++;
            } else {
              break;
            }
          }
        }

        // Award streak achievement
        if (winStreak >= 3 && !hasAchievement('WINNING_STREAK')) {
          await awardAchievement('WINNING_STREAK', battleId);
        }
      }

    } catch (error) {
      console.error('Error checking battle achievements:', error);
    }
  }, [user, awardAchievement, hasAchievement]);

  // Clear new achievement notification
  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  // Load achievements on mount
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    userAchievements,
    hasAchievement,
    awardAchievement,
    checkBattleAchievements,
    newAchievement,
    clearNewAchievement,
    loading
  };
}
