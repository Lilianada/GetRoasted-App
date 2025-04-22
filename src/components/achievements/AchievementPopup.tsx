
import React, { useState, useEffect } from 'react';
import { Trophy, X, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Achievement } from '@/types/achievement';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementPopup = ({ achievement, onClose }: AchievementPopupProps) => {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Staggered animation
  useEffect(() => {
    // Show popup with delay for entrance animation
    const timer1 = setTimeout(() => setShow(true), 100);
    
    // Show confetti animation shortly after popup appears
    const timer2 = setTimeout(() => setConfetti(true), 600);
    
    // Auto-hide after 8 seconds if user doesn't close manually
    const timer3 = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 400); // Allow exit animation to play
    }, 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onClose]);

  const rarityColors = {
    common: 'border-gray-400 bg-gray-100',
    uncommon: 'border-green-400 bg-green-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-yellow-400 bg-yellow-50',
  };

  const rarityGlow = {
    common: '',
    uncommon: 'shadow-sm',
    rare: 'shadow-md shadow-blue-200',
    epic: 'shadow-lg shadow-purple-200',
    legendary: 'shadow-xl shadow-yellow-200 animate-pulse',
  };

  return (
    <div className={cn(
      "fixed bottom-8 right-8 transform transition-all duration-500 z-50",
      show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
    )}>
      <Card className={cn(
        "border-4 p-1 max-w-sm transition-all", 
        rarityColors[achievement.rarity],
        rarityGlow[achievement.rarity],
      )}>
        <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Trophy className={cn(
              "h-5 w-5", 
              achievement.rarity === 'legendary' ? "text-yellow-500" : 
              achievement.rarity === 'epic' ? "text-purple-500" : 
              achievement.rarity === 'rare' ? "text-blue-500" : 
              achievement.rarity === 'uncommon' ? "text-green-500" : "text-gray-500"
            )} />
            Achievement Unlocked!
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => {
            setShow(false);
            setTimeout(onClose, 400);
          }}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center border-2",
                rarityColors[achievement.rarity]
              )}>
                <Award className="h-8 w-8 text-night-700" />
              </div>
              {confetti && (
                <div className="absolute -top-2 -right-2 -left-2 -bottom-2 confetti-container">
                  {/* Confetti animation would be rendered here */}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{achievement.name}</h3>
              <p className="text-sm text-gray-500">{achievement.description}</p>
              <div className="mt-1 flex items-center gap-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  achievement.rarity === 'legendary' ? "bg-yellow-100 text-yellow-700" : 
                  achievement.rarity === 'epic' ? "bg-purple-100 text-purple-700" : 
                  achievement.rarity === 'rare' ? "bg-blue-100 text-blue-700" : 
                  achievement.rarity === 'uncommon' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                )}>
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementPopup;
