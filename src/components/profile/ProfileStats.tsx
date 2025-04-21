
import React from 'react';
import { Card } from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { Trophy, Award, Target, Flame, Calendar } from 'lucide-react';

interface ProfileStatsProps {
  loading: boolean;
  stats: {
    battles: number;
    wins: number;
    winRate: number;
    longestStreak: number;
    lastBattle?: string;
    averageScore?: number;
  };
}

const ProfileStats = ({ loading, stats }: ProfileStatsProps) => {
  if (loading) {
    return (
      <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
        <div className="flex justify-center p-8">
          <Loader size="large" variant="colorful" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
      <h2 className="text-xl font-bold mb-6">Player Statistics</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col items-center p-3 rounded-lg bg-night-700 text-white">
          <Trophy className="mb-1 text-primary" />
          <span className="text-xl font-bold">{stats.battles}</span>
          <span className="text-xs">Total Battles</span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-night-700 text-white">
          <Award className="mb-1 text-yellow" />
          <span className="text-xl font-bold">{stats.wins}</span>
          <span className="text-xs">Wins</span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-night-700 text-white">
          <Target className="mb-1 text-blue" />
          <span className="text-xl font-bold">{stats.winRate}%</span>
          <span className="text-xs">Win Rate</span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-night-700 text-white">
          <Flame className="mb-1 text-accent" />
          <span className="text-xl font-bold">{stats.longestStreak}</span>
          <span className="text-xs">Best Streak</span>
        </div>
        
        {stats.averageScore !== undefined && (
          <div className="flex flex-col items-center p-3 rounded-lg bg-night-700 text-white">
            <Award className="mb-1 text-purple" />
            <span className="text-xl font-bold">{stats.averageScore.toFixed(1)}</span>
            <span className="text-xs">Avg Score</span>
          </div>
        )}
        
        {stats.lastBattle && (
          <div className="flex flex-col items-center p-3 rounded-lg bg-night-700 text-white">
            <Calendar className="mb-1 text-secondary" />
            <span className="text-sm font-bold truncate">{stats.lastBattle}</span>
            <span className="text-xs">Last Battle</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileStats;
