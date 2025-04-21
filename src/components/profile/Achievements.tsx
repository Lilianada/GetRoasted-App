
import React from 'react';
import { Card } from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import { Trophy, Award, Medal, Star } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
  icon: string;
}

interface AchievementsProps {
  loading: boolean;
  achievements: Achievement[];
}

const Achievements = ({ loading, achievements }: AchievementsProps) => {
  if (loading) {
    return (
      <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
        <h2 className="text-xl font-bold mb-6">Achievements</h2>
        <div className="flex justify-center p-8">
          <Loader size="large" variant="colorful" />
        </div>
      </Card>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="text-yellow" />;
      case 'award': return <Award className="text-primary" />;
      case 'medal': return <Medal className="text-blue" />;
      default: return <Star className="text-purple" />;
    }
  };

  return (
    <Card className="p-6 bg-secondary border-2 border-black text-black shadow-neo relative overflow-hidden">
      <h2 className="text-xl font-bold mb-6">Achievements</h2>
      
      {achievements.length === 0 ? (
        <div className="text-center p-8 text-night-400">
          No achievements yet. Keep playing to unlock achievements!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-4 border-2 rounded-lg transition-all flex items-center gap-3
                ${achievement.unlocked 
                  ? 'border-primary bg-primary/10 text-black' 
                  : 'border-night-700 bg-night-700/10 text-night-400'}`}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-night-800">
                {getIcon(achievement.icon)}
              </div>
              
              <div className="flex-grow">
                <h3 className={`font-bold ${achievement.unlocked ? 'text-black' : 'text-night-500'}`}>
                  {achievement.title}
                </h3>
                <p className="text-xs mt-1">{achievement.description}</p>
                
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-2 bg-night-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, (achievement.progress / (achievement.total || 1) * 100))}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-night-400">
                      {achievement.progress} / {achievement.total}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Achievements;
