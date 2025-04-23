
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/context/AuthContext';
import { Achievement, UserAchievement } from '@/types/achievement';
import { toast } from '@/components/ui/sonner';

// Achievement definitions
export const ACHIEVEMENTS: Record<string, Achievement> = {
  'first-battle': {
    id: 'first-battle',
    name: 'Rookie Roaster',
    description: 'Completed your first battle',
    icon: 'trophy',
    category: 'battle',
    rarity: 'common'
  },
  'first-win': {
    id: 'first-win',
    name: 'Victory Lap',
    description: 'Won your first battle',
    icon: 'award',
    category: 'battle',
    rarity: 'uncommon'
  },
  'perfect-score': {
    id: 'perfect-score',
    name: 'Perfect Roast',
    description: 'Achieved a perfect score in a round',
    icon: 'trophy',
    category: 'performance',
    rarity: 'rare'
  },
  'comeback-win': {
    id: 'comeback-win',
    name: 'Comeback King',
    description: 'Won a battle after trailing in earlier rounds',
    icon: 'trophy',
    category: 'performance',
    rarity: 'rare'
  },
  'ten-battles': {
    id: 'ten-battles',
    name: 'Seasoned Roaster',
    description: 'Completed 10 battles',
    icon: 'trophy',
    category: 'battle',
    rarity: 'uncommon'
  },
  'popular-battle': {
    id: 'popular-battle',
    name: 'Crowd Pleaser',
    description: 'Had 10+ spectators in a battle',
    icon: 'trophy',
    category: 'community',
    rarity: 'rare'
  },
  'five-wins': {
    id: 'five-wins',
    name: 'Roast Master',
    description: 'Won 5 battles',
    icon: 'trophy',
    category: 'performance',
    rarity: 'epic'
  },
  'no-time-wasted': {
    id: 'no-time-wasted',
    name: 'Quick Wit',
    description: 'Used less than half the allotted time in all turns of a battle',
    icon: 'trophy',
    category: 'performance',
    rarity: 'rare'
  },
  'crowd-favorite': {
    id: 'crowd-favorite',
    name: 'Crowd Favorite',
    description: 'Got the most audience votes in 3 consecutive battles',
    icon: 'trophy',
    category: 'community',
    rarity: 'legendary'
  }
};

export function useAchievements() {
  const { user } = useAuthContext();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Fetch user achievements
  useEffect(() => {
    const fetchUserAchievements = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Transform data to match UserAchievement interface
        const achievementData: UserAchievement[] = (data || []).map(item => ({
          id: item.id,
          userId: item.user_id,
          achievementId: item.achievement_id,
          earnedAt: item.earned_at,
          battleId: item.battle_id
        }));
        
        setUserAchievements(achievementData);
      } catch (error) {
        console.error('Error fetching user achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAchievements();
  }, [user]);

  // Check if user has achievement
  const hasAchievement = useCallback((achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  }, [userAchievements]);

  // Award achievement
  const awardAchievement = useCallback(async (achievementId: string, battleId?: string) => {
    if (!user || hasAchievement(achievementId)) return;
    
    try {
      const achievement = ACHIEVEMENTS[achievementId];
      if (!achievement) {
        console.error(`Achievement ${achievementId} not found`);
        return;
      }
      
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          earned_at: new Date().toISOString(),
          battle_id: battleId
        });
        
      if (error) throw error;
      
      // Set the new achievement to trigger popup
      setNewAchievement(achievement);
      
      // Update local state
      setUserAchievements(prev => [...prev, {
        id: `${user.id}-${achievementId}`,
        userId: user.id,
        achievementId: achievementId,
        earnedAt: new Date().toISOString(),
        battleId
      }]);
      
      console.log(`Achievement unlocked: ${achievement.name}`);
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  }, [user, hasAchievement]);

  // Check for achievements based on battle results
  const checkBattleAchievements = useCallback(async (
    battleData: any, 
    isWinner: boolean, 
    userScore: number, 
    spectatorCount: number
  ) => {
    if (!user) return;

    try {
      // Get total battles count
      const { count: battlesCount, error: battlesError } = await supabase
        .from('battle_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
  
      if (battlesError) throw battlesError;
  
      // Get wins count
      const { count: winsCount, error: winsError } = await supabase
        .from('battles')
        .select('*', { count: 'exact', head: true })
        .eq('winner_id', user.id);
      
      if (winsError) throw winsError;
      
      // Check for first battle achievement
      if (battlesCount === 1) {
        awardAchievement('first-battle', battleData.id);
      }
      
      // Check for tenth battle achievement
      if (battlesCount === 10) {
        awardAchievement('ten-battles', battleData.id);
      }
      
      // Check for first win achievement
      if (isWinner && winsCount === 1) {
        awardAchievement('first-win', battleData.id);
      }
      
      // Check for fifth win achievement
      if (isWinner && winsCount === 5) {
        awardAchievement('five-wins', battleData.id);
      }
      
      // Check for perfect score
      if (userScore >= 50) {  // Arbitrary threshold for "perfect" score
        awardAchievement('perfect-score', battleData.id);
      }
      
      // Check for popular battle
      if (spectatorCount >= 10) {
        awardAchievement('popular-battle', battleData.id);
      }
    } catch (error) {
      console.error('Error checking battle achievements:', error);
    }
  }, [user, awardAchievement]);

  // Clear new achievement after it's been displayed
  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

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
